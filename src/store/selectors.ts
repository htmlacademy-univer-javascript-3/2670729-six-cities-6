import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Offer, AuthInfo } from '../types';
import type { AuthorizationStatus } from './auth/reducer';

// Базовые селекторы
export const getCity = (state: RootState): string => state.offers.city;

export const getOffers = (state: RootState): Offer[] => state.offers.offers;

export const getIsLoading = (state: RootState): boolean => state.offers.isLoading;

export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.auth.authorizationStatus;

export const getUser = (state: RootState): AuthInfo | null => state.auth.user;

// Мемоизированный селектор для фильтрации предложений по городу
export const getOffersByCity = createSelector(
  [getCity, getOffers],
  (city, offers) => offers.filter((offer) => offer.city === city)
);

