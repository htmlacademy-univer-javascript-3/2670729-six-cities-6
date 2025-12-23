import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { configureStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import {
  fetchOffers,
  checkAuth,
  loginAction,
  logoutAction,
  fetchOfferById,
  fetchNearbyOffers,
  fetchReviews,
  postReview,
  toggleFavorite,
  fetchFavorites,
  ActionType,
} from './actions';
import { reducer } from './reducer';
import type { RootState } from './index';
import type { AuthInfo } from '../types';
import * as apiModule from '../api';

// Мокируем функции работы с токеном
vi.mock('../api', () => ({
  saveToken: vi.fn(),
  dropToken: vi.fn(),
}));

const createMockStore = (api: AxiosInstance): Store<RootState> =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });

const mockServerOffer = {
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 120,
  city: {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  description: 'Test description',
  bedrooms: 2,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  images: ['image1.jpg', 'image2.jpg'],
  maxAdults: 4,
  previewImage: 'preview.jpg',
};

const mockServerReview = {
  id: '1',
  date: '2024-01-01T00:00:00.000Z',
  user: {
    name: 'Jane Doe',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  comment: 'Great place!',
  rating: 5,
};

const mockAuthInfo: AuthInfo = {
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'avatar.jpg',
  isPro: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThunkAction = any;

describe('Async actions', () => {
  let api: AxiosInstance;
  let mockAdapter: AxiosMockAdapter;

  beforeEach(() => {
    api = axios.create();
    mockAdapter = new AxiosMockAdapter(api, { delayResponse: 0 });
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAdapter.restore();
  });

  describe('fetchOffers', () => {
    it('should dispatch SET_LOADING and LOAD_OFFERS on success', async () => {
      const serverOffers = [mockServerOffer];
      mockAdapter.onGet('/offers').reply(200, serverOffers);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(fetchOffers() as ThunkAction);

      const state = store.getState();
      expect(state.offers.offers).toHaveLength(1);
      expect(state.offers.offers[0]?.id).toBe('1');
      expect(state.offers.offers[0]?.name).toBe('Test Offer');
      expect(state.offers.isLoading).toBe(false);
    });

    it('should handle error and set loading to false', async () => {
      mockAdapter.onGet('/offers').reply(500);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(fetchOffers() as ThunkAction);

      const state = store.getState();
      expect(state.offers.isLoading).toBe(false);
      expect(state.offers.offers).toHaveLength(0);
    });

    it('should adapt server offers correctly', async () => {
      const serverOffers = [mockServerOffer];
      mockAdapter.onGet('/offers').reply(200, serverOffers);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(fetchOffers() as ThunkAction);

      const state = store.getState();
      const offer = state.offers.offers[0];
      if (offer) {
        expect(offer.mark).toBe('Premium');
        expect(offer.priceValue).toBe('120');
        expect(offer.images).toEqual(['image1.jpg', 'image2.jpg']);
        expect(offer.goods).toEqual(['Wi-Fi', 'Kitchen']);
      }
    });
  });

  describe('checkAuth', () => {
    it('should dispatch AUTH actions on successful auth', async () => {
      mockAdapter.onGet('/login').reply(200, mockAuthInfo);
      mockAdapter.onGet('/favorite').reply(200, []);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(checkAuth() as ThunkAction);

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('AUTH');
      expect(state.auth.user).toEqual(mockAuthInfo);
      expect(state.auth.favoriteCount).toBe(0);
    });

    it('should set favorite count from favorites response', async () => {
      const favorites = [mockServerOffer, { ...mockServerOffer, id: '2' }];
      mockAdapter.onGet('/login').reply(200, mockAuthInfo);
      mockAdapter.onGet('/favorite').reply(200, favorites);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(checkAuth() as ThunkAction);

      const state = store.getState();
      expect(state.auth.favoriteCount).toBe(2);
    });

    it('should handle favorite count error and set to 0', async () => {
      mockAdapter.onGet('/login').reply(200, mockAuthInfo);
      mockAdapter.onGet('/favorite').reply(500);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(checkAuth() as ThunkAction);

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('AUTH');
      expect(state.auth.favoriteCount).toBe(0);
    });

    it('should dispatch NO_AUTH actions on auth failure', async () => {
      mockAdapter.onGet('/login').reply(401);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(checkAuth() as ThunkAction);

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('NO_AUTH');
      expect(state.auth.user).toBeNull();
      expect(state.auth.favoriteCount).toBe(0);
    });
  });

  describe('loginAction', () => {
    it('should dispatch AUTH actions and save token on success', async () => {
      mockAdapter.onPost('/login').reply(200, mockAuthInfo);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(loginAction('test@example.com', 'password') as ThunkAction);

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('AUTH');
      expect(state.auth.user).toEqual(mockAuthInfo);
      expect(apiModule.saveToken).toHaveBeenCalledWith('test-token');
    });

    it('should dispatch NO_AUTH actions on failure', async () => {
      mockAdapter.onPost('/login').reply(401);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await expect(store.dispatch(loginAction('test@example.com', 'wrong') as ThunkAction)).rejects.toBeDefined();

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('NO_AUTH');
      expect(state.auth.user).toBeNull();
    });
  });

  describe('logoutAction', () => {
    it('should dispatch NO_AUTH actions and drop token', () => {
      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      store.dispatch(logoutAction() as ThunkAction);

      const state = store.getState();
      expect(state.auth.authorizationStatus).toBe('NO_AUTH');
      expect(state.auth.user).toBeNull();
      expect(apiModule.dropToken).toHaveBeenCalled();
    });
  });

  describe('fetchOfferById', () => {
    it('should return adapted offer', async () => {
      mockAdapter.onGet('/offers/1').reply(200, mockServerOffer);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const offer = (await store.dispatch(fetchOfferById('1') as ThunkAction)) as unknown as import('../types').Offer;

      expect(offer.id).toBe('1');
      expect(offer.name).toBe('Test Offer');
      expect(offer.mark).toBe('Premium');
    });
  });

  describe('fetchNearbyOffers', () => {
    it('should return adapted offers array', async () => {
      const serverOffers = [mockServerOffer, { ...mockServerOffer, id: '2' }];
      mockAdapter.onGet('/offers/1/nearby').reply(200, serverOffers);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const offers = (await store.dispatch(fetchNearbyOffers('1') as ThunkAction)) as unknown as import('../types').Offer[];

      expect(offers).toHaveLength(2);
      if (offers[0] && offers[1]) {
        expect(offers[0].id).toBe('1');
        expect(offers[1].id).toBe('2');
      }
    });
  });

  describe('fetchReviews', () => {
    it('should return sorted and limited reviews', async () => {
      const reviews = [
        { ...mockServerReview, id: '1', date: '2024-01-03T00:00:00.000Z' },
        { ...mockServerReview, id: '2', date: '2024-01-01T00:00:00.000Z' },
        { ...mockServerReview, id: '3', date: '2024-01-02T00:00:00.000Z' },
      ];
      mockAdapter.onGet('/comments/1').reply(200, reviews);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const result = (await store.dispatch(fetchReviews('1') as ThunkAction)) as unknown as import('../types').Review[];

      expect(result).toHaveLength(3);
      if (result[0] && result[1] && result[2]) {
        expect(result[0].id).toBe('1'); // Новейший первый
        expect(result[1].id).toBe('3');
        expect(result[2].id).toBe('2');
      }
    });

    it('should limit reviews to 10', async () => {
      const reviews = Array.from({ length: 15 }, (_, i) => ({
        ...mockServerReview,
        id: String(i + 1),
        date: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`,
      }));
      mockAdapter.onGet('/comments/1').reply(200, reviews);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const result = (await store.dispatch(fetchReviews('1') as ThunkAction)) as unknown as import('../types').Review[];

      expect(result).toHaveLength(10);
    });
  });

  describe('postReview', () => {
    it('should return adapted review', async () => {
      mockAdapter.onPost('/comments/1').reply(200, mockServerReview);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const review = (await store.dispatch(postReview('1', 5, 'Great!') as ThunkAction)) as unknown as import('../types').Review;

      expect(review.id).toBe('1');
      expect(review.offerID).toBe('1');
      expect(review.comment).toBe('Great place!');
      expect(review.rating).toBe(5);
    });
  });

  describe('toggleFavorite', () => {
    it('should dispatch UPDATE_OFFER_FAVORITE and SET_FAVORITE_COUNT on success', async () => {
      const updatedOffer = { ...mockServerOffer, isFavorite: true };
      mockAdapter.onPost('/favorite/1/1').reply(200, updatedOffer);
      mockAdapter.onGet('/favorite').reply(200, [updatedOffer]);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(toggleFavorite('1', true) as ThunkAction);

      const state = store.getState();
      expect(state.offers.offers).toHaveLength(0); // Offers не загружены, но действие диспатчится
      expect(state.auth.favoriteCount).toBe(1);
    });

    it('should handle favorite count error and calculate locally', async () => {
      const updatedOffer = { ...mockServerOffer, isFavorite: true };
      mockAdapter.onPost('/favorite/1/1').reply(200, updatedOffer);
      mockAdapter.onGet('/favorite').reply(500);

      const store = createMockStore(api);
      // Устанавливаем начальное состояние
      store.dispatch({
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 5,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(toggleFavorite('1', true) as ThunkAction);

      const state = store.getState();
      expect(state.auth.favoriteCount).toBe(6); // 5 + 1
    });

    it('should decrease favorite count when removing from favorites', async () => {
      const updatedOffer = { ...mockServerOffer, isFavorite: false };
      mockAdapter.onPost('/favorite/1/0').reply(200, updatedOffer);
      mockAdapter.onGet('/favorite').reply(500);

      const store = createMockStore(api);
      store.dispatch({
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 5,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(toggleFavorite('1', false) as ThunkAction);

      const state = store.getState();
      expect(state.auth.favoriteCount).toBe(4); // 5 - 1
    });

    it('should not decrease favorite count below 0', async () => {
      const updatedOffer = { ...mockServerOffer, isFavorite: false };
      mockAdapter.onPost('/favorite/1/0').reply(200, updatedOffer);
      mockAdapter.onGet('/favorite').reply(500);

      const store = createMockStore(api);
      store.dispatch({
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 0,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      await store.dispatch(toggleFavorite('1', false) as ThunkAction);

      const state = store.getState();
      expect(state.auth.favoriteCount).toBe(0); // Не меньше 0
    });
  });

  describe('fetchFavorites', () => {
    it('should return adapted offers array', async () => {
      const serverOffers = [mockServerOffer, { ...mockServerOffer, id: '2' }];
      mockAdapter.onGet('/favorite').reply(200, serverOffers);

      const store = createMockStore(api);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/await-thenable
      const offers = (await store.dispatch(fetchFavorites() as ThunkAction)) as unknown as import('../types').Offer[];

      expect(offers).toHaveLength(2);
      if (offers[0] && offers[1]) {
        expect(offers[0].id).toBe('1');
        expect(offers[1].id).toBe('2');
      }
    });
  });
});

