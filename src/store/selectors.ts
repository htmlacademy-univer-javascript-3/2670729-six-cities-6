import type { RootState } from './index';
import type { Offer } from '../mocks';

export const getCity = (state: RootState): string => state.city;

export const getOffers = (state: RootState): Offer[] => state.offers;

export const getOffersByCity = (state: RootState): Offer[] => {
  const city = getCity(state);
  const offers = getOffers(state);
  return offers.filter((offer) => offer.city === city);
};

