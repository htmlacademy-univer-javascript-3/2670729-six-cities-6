import { describe, it, expect } from 'vitest';
import { offersReducer, type OffersState } from './reducer';
import { ActionType, type Action } from '../actions';
import type { Offer } from '../../types';

const mockOffer: Offer = {
  id: '1',
  mark: 'Premium',
  priceValue: '120',
  priceText: 'night',
  name: 'Test Offer',
  type: 'apartment',
  rating: 4.5,
  images: ['image1.jpg'],
  bedrooms: 2,
  maxAdults: 4,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'John Doe',
    avatar: 'avatar.jpg',
    isPro: true,
  },
  description: ['Test description'],
  location: {
    latitude: 52.370216,
    longitude: 4.895168,
  },
  city: 'Amsterdam',
  isFavorite: false,
};

const mockOffer2: Offer = {
  id: '2',
  mark: '',
  priceValue: '80',
  priceText: 'night',
  name: 'Test Offer 2',
  type: 'room',
  rating: 4.0,
  images: ['image2.jpg'],
  bedrooms: 1,
  maxAdults: 2,
  goods: ['Wi-Fi'],
  host: {
    name: 'Jane Doe',
    avatar: 'avatar2.jpg',
    isPro: false,
  },
  description: ['Test description 2'],
  location: {
    latitude: 52.370216,
    longitude: 4.895168,
  },
  city: 'Paris',
  isFavorite: true,
};

const initialState: OffersState = {
  offers: [],
  isLoading: false,
  city: 'Paris',
};

describe('offersReducer', () => {
  it('should return initial state when state is undefined', () => {
    const action = { type: 'UNKNOWN_ACTION' } as Action;
    const result = offersReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should return current state for unknown action', () => {
    const currentState: OffersState = {
      offers: [mockOffer],
      isLoading: true,
      city: 'Amsterdam',
    };
    const action = { type: 'UNKNOWN_ACTION' } as Action;
    const result = offersReducer(currentState, action);
    expect(result).toBe(currentState);
  });

  describe('CHANGE_CITY', () => {
    it('should change city', () => {
      const action: Action = {
        type: ActionType.CHANGE_CITY,
        payload: 'Amsterdam',
      };
      const result = offersReducer(initialState, action);
      expect(result.city).toBe('Amsterdam');
      expect(result.offers).toEqual(initialState.offers);
      expect(result.isLoading).toBe(initialState.isLoading);
    });

    it('should change city to different value', () => {
      const currentState: OffersState = {
        offers: [mockOffer],
        isLoading: false,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.CHANGE_CITY,
        payload: 'Cologne',
      };
      const result = offersReducer(currentState, action);
      expect(result.city).toBe('Cologne');
      expect(result.offers).toEqual(currentState.offers);
      expect(result.isLoading).toBe(currentState.isLoading);
    });
  });

  describe('LOAD_OFFERS', () => {
    it('should load offers', () => {
      const offers: Offer[] = [mockOffer, mockOffer2];
      const action: Action = {
        type: ActionType.LOAD_OFFERS,
        payload: offers,
      };
      const result = offersReducer(initialState, action);
      expect(result.offers).toEqual(offers);
      expect(result.offers.length).toBe(2);
      expect(result.city).toBe(initialState.city);
      expect(result.isLoading).toBe(initialState.isLoading);
    });

    it('should replace existing offers', () => {
      const currentState: OffersState = {
        offers: [mockOffer],
        isLoading: false,
        city: 'Paris',
      };
      const newOffers: Offer[] = [mockOffer2];
      const action: Action = {
        type: ActionType.LOAD_OFFERS,
        payload: newOffers,
      };
      const result = offersReducer(currentState, action);
      expect(result.offers).toEqual(newOffers);
      expect(result.offers.length).toBe(1);
      expect(result.offers[0].id).toBe('2');
    });

    it('should load empty array', () => {
      const currentState: OffersState = {
        offers: [mockOffer],
        isLoading: false,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.LOAD_OFFERS,
        payload: [],
      };
      const result = offersReducer(currentState, action);
      expect(result.offers).toEqual([]);
      expect(result.offers.length).toBe(0);
    });
  });

  describe('SET_LOADING', () => {
    it('should set loading to true', () => {
      const action: Action = {
        type: ActionType.SET_LOADING,
        payload: true,
      };
      const result = offersReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.offers).toEqual(initialState.offers);
      expect(result.city).toBe(initialState.city);
    });

    it('should set loading to false', () => {
      const currentState: OffersState = {
        offers: [mockOffer],
        isLoading: true,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.SET_LOADING,
        payload: false,
      };
      const result = offersReducer(currentState, action);
      expect(result.isLoading).toBe(false);
      expect(result.offers).toEqual(currentState.offers);
      expect(result.city).toBe(currentState.city);
    });
  });

  describe('UPDATE_OFFER_FAVORITE', () => {
    it('should update favorite status of existing offer', () => {
      const currentState: OffersState = {
        offers: [mockOffer, mockOffer2],
        isLoading: false,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.UPDATE_OFFER_FAVORITE,
        payload: {
          offerId: '1',
          isFavorite: true,
        },
      };
      const result = offersReducer(currentState, action);
      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(true); // unchanged
      expect(result.offers.length).toBe(2);
    });

    it('should update favorite status to false', () => {
      const currentState: OffersState = {
        offers: [mockOffer, mockOffer2],
        isLoading: false,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.UPDATE_OFFER_FAVORITE,
        payload: {
          offerId: '2',
          isFavorite: false,
        },
      };
      const result = offersReducer(currentState, action);
      expect(result.offers[0].isFavorite).toBe(false); // unchanged
      expect(result.offers[1].isFavorite).toBe(false);
    });

    it('should not modify offers if offerId does not exist', () => {
      const currentState: OffersState = {
        offers: [mockOffer],
        isLoading: false,
        city: 'Paris',
      };
      const action: Action = {
        type: ActionType.UPDATE_OFFER_FAVORITE,
        payload: {
          offerId: '999',
          isFavorite: true,
        },
      };
      const result = offersReducer(currentState, action);
      expect(result.offers).toEqual(currentState.offers);
      expect(result.offers[0].isFavorite).toBe(false);
    });

    it('should handle empty offers array', () => {
      const action: Action = {
        type: ActionType.UPDATE_OFFER_FAVORITE,
        payload: {
          offerId: '1',
          isFavorite: true,
        },
      };
      const result = offersReducer(initialState, action);
      expect(result.offers).toEqual([]);
    });
  });
});

