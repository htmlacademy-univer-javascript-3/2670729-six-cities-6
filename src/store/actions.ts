import type { Offer, AuthInfo, Review } from '../types';
import type { AxiosInstance } from 'axios';
import type { AppDispatch, RootState } from './index';
import type { AuthorizationStatus } from './reducer';
import { saveToken, dropToken } from '../api';

export const ActionType = {
  CHANGE_CITY: 'CHANGE_CITY',
  LOAD_OFFERS: 'LOAD_OFFERS',
  SET_LOADING: 'SET_LOADING',
  REQUIRE_AUTHORIZATION: 'REQUIRE_AUTHORIZATION',
  SET_USER: 'SET_USER',
} as const;

export interface ChangeCityAction {
  type: typeof ActionType.CHANGE_CITY;
  payload: string;
}

export interface LoadOffersAction {
  type: typeof ActionType.LOAD_OFFERS;
  payload: Offer[];
}

export interface SetLoadingAction {
  type: typeof ActionType.SET_LOADING;
  payload: boolean;
}

export interface RequireAuthorizationAction {
  type: typeof ActionType.REQUIRE_AUTHORIZATION;
  payload: AuthorizationStatus;
}

export interface SetUserAction {
  type: typeof ActionType.SET_USER;
  payload: AuthInfo | null;
}

export type Action = ChangeCityAction | LoadOffersAction | SetLoadingAction | RequireAuthorizationAction | SetUserAction;

export const changeCity = (city: string): ChangeCityAction => ({
  type: ActionType.CHANGE_CITY,
  payload: city,
});

export const loadOffers = (offers: Offer[]): LoadOffersAction => ({
  type: ActionType.LOAD_OFFERS,
  payload: offers,
});

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: ActionType.SET_LOADING,
  payload: isLoading,
});

export const requireAuthorization = (status: AuthorizationStatus): RequireAuthorizationAction => ({
  type: ActionType.REQUIRE_AUTHORIZATION,
  payload: status,
});

export const setUser = (user: AuthInfo | null): SetUserAction => ({
  type: ActionType.SET_USER,
  payload: user,
});

// Тип для данных с сервера (может отличаться от нашего типа Offer)
interface ServerOffer {
  id: string;
  title: string;
  type: string;
  price: number;
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  isFavorite?: boolean;
  isPremium?: boolean;
  rating: number;
  description?: string;
  bedrooms?: number;
  goods?: string[];
  host?: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  images?: string[];
  maxAdults?: number;
  previewImage?: string;
}

// Адаптер для преобразования данных с сервера в наш формат
const adaptOffer = (serverOffer: ServerOffer): Offer => {
  // Безопасно получаем images
  const images = (() => {
    if (serverOffer.images && serverOffer.images.length > 0) {
      return serverOffer.images;
    }
    if (serverOffer.previewImage) {
      return [serverOffer.previewImage];
    }
    return [];
  })();

  // Безопасно получаем goods
  const goods = serverOffer.goods || [];

  // Безопасно получаем description
  const description = serverOffer.description ? [serverOffer.description] : [];

  return {
    id: serverOffer.id,
    mark: serverOffer.isPremium ? 'Premium' : '',
    priceValue: String(serverOffer.price),
    priceText: 'night',
    name: serverOffer.title,
    type: serverOffer.type,
    rating: serverOffer.rating,
    images,
    bedrooms: serverOffer.bedrooms || 0,
    maxAdults: serverOffer.maxAdults || 0,
    goods,
    host: {
      name: serverOffer.host?.name || '',
      avatar: serverOffer.host?.avatarUrl || '',
      isPro: serverOffer.host?.isPro || false,
    },
    description,
    location: {
      latitude: serverOffer.location?.latitude || 0,
      longitude: serverOffer.location?.longitude || 0,
    },
    city: serverOffer.city?.name || '',
    isFavorite: serverOffer.isFavorite || false,
  };
};

export const fetchOffers = (): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<void>) =>
  async (dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const { data } = await api.get<ServerOffer[]>('/offers');
      const adaptedOffers = data.map(adaptOffer);

      dispatch(loadOffers(adaptedOffers));
      dispatch(setLoading(false));
    } catch (error) {
      // В случае ошибки не загружаем данные
      dispatch(setLoading(false));
    }
  };

// Проверка авторизации при старте приложения
export const checkAuth = (): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<void>) =>
  async (dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<void> => {
    try {
      const { data } = await api.get<AuthInfo>('/login');
      dispatch(requireAuthorization('AUTH'));
      dispatch(setUser(data));
    } catch (error) {
      dispatch(requireAuthorization('NO_AUTH'));
      dispatch(setUser(null));
    }
  };

// Авторизация пользователя
export const loginAction = (email: string, password: string): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<void>) =>
  async (dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<void> => {
    try {
      const { data } = await api.post<AuthInfo>('/login', { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization('AUTH'));
      dispatch(setUser(data));
    } catch (error) {
      dispatch(requireAuthorization('NO_AUTH'));
      dispatch(setUser(null));
      throw error;
    }
  };

export const logoutAction = (): ((dispatch: AppDispatch) => void) =>
  (dispatch: AppDispatch): void => {
    dropToken();
    dispatch(requireAuthorization('NO_AUTH'));
    dispatch(setUser(null));
  };

// Тип для Review с сервера
interface ServerReview {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
}

// Адаптер для преобразования Review с сервера в наш формат
const adaptReview = (serverReview: ServerReview, offerId: string): Review => ({
  id: serverReview.id,
  offerID: offerId,
  user: {
    name: serverReview.user?.name || '',
    avatar: serverReview.user?.avatarUrl || '',
  },
  rating: serverReview.rating,
  comment: serverReview.comment,
  date: serverReview.date,
});

// Загрузка предложения по ID
export const fetchOfferById = (id: string): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<Offer>) =>
  async (_dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<Offer> => {
    const { data } = await api.get<ServerOffer>(`/offers/${id}`);
    return adaptOffer(data);
  };

// Загрузка ближайших предложений
export const fetchNearbyOffers = (id: string): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<Offer[]>) =>
  async (_dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<Offer[]> => {
    const { data } = await api.get<ServerOffer[]>(`/offers/${id}/nearby`);
    return data.map(adaptOffer);
  };

// Загрузка комментариев для предложения
export const fetchReviews = (id: string): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<Review[]>) =>
  async (_dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<Review[]> => {
    const { data } = await api.get<ServerReview[]>(`/comments/${id}`);
    // Сортируем от новых к старым
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Берем максимум 10 отзывов
    const limitedData = sortedData.slice(0, 10);
    return limitedData.map((review) => adaptReview(review, id));
  };

// Отправка комментария
export const postReview = (offerId: string, rating: number, comment: string): ((dispatch: AppDispatch, getState: () => RootState, api: AxiosInstance) => Promise<Review>) =>
  async (_dispatch: AppDispatch, _getState: () => RootState, api: AxiosInstance): Promise<Review> => {
    const { data } = await api.post<ServerReview>(`/comments/${offerId}`, { rating, comment });
    return adaptReview(data, offerId);
  };

