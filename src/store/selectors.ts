import type { RootState } from './index';
import type { Offer } from '../types';

export const getCity = (state: RootState): string => state.city;

export const getOffers = (state: RootState): Offer[] => state.offers;

export const getIsLoading = (state: RootState): boolean => state.isLoading;

export const getOffersByCity = (state: RootState): Offer[] => {
  const city = getCity(state);
  const offers = getOffers(state);
  return offers.filter((offer) => offer.city === city);
};

