import type { RootState } from './index';
import type { Offer, AuthInfo } from '../types';
import type { AuthorizationStatus } from './reducer';

export const getCity = (state: RootState): string => state.city;

export const getOffers = (state: RootState): Offer[] => state.offers;

export const getIsLoading = (state: RootState): boolean => state.isLoading;

export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.authorizationStatus;

export const getUser = (state: RootState): AuthInfo | null => state.user;

export const getOffersByCity = (state: RootState): Offer[] => {
  const city = getCity(state);
  const offers = getOffers(state);
  return offers.filter((offer) => offer.city === city);
};

