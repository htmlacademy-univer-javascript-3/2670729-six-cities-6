import { describe, it, expect } from 'vitest';
import { reducer } from './reducer';
import { ActionType, type Action } from './actions';
import type { Offer, AuthInfo } from '../types';

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

const mockUser: AuthInfo = {
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'avatar.jpg',
  isPro: true,
};

describe('reducer', () => {
  it('should return initial state when state is undefined', () => {
    const action = { type: 'UNKNOWN_ACTION' } as Action;
    const result = reducer(undefined, action);
    expect(result).toEqual({
      offers: {
        offers: [],
        isLoading: false,
        city: 'Paris',
      },
      auth: {
        authorizationStatus: 'UNKNOWN',
        user: null,
        favoriteCount: 0,
      },
    });
  });

  it('should handle offers actions', () => {
    let state = reducer(undefined, {
      type: ActionType.CHANGE_CITY,
      payload: 'Amsterdam',
    } as Action);

    expect(state.offers.city).toBe('Amsterdam');
    expect(state.auth).toEqual({
      authorizationStatus: 'UNKNOWN',
      user: null,
      favoriteCount: 0,
    });

    state = reducer(state, {
      type: ActionType.LOAD_OFFERS,
      payload: [mockOffer],
    } as Action);

    expect(state.offers.offers).toEqual([mockOffer]);
    expect(state.offers.offers.length).toBe(1);

    state = reducer(state, {
      type: ActionType.SET_LOADING,
      payload: true,
    } as Action);

    expect(state.offers.isLoading).toBe(true);
  });

  it('should handle auth actions', () => {
    let state = reducer(undefined, {
      type: ActionType.REQUIRE_AUTHORIZATION,
      payload: 'AUTH',
    } as Action);

    expect(state.auth.authorizationStatus).toBe('AUTH');
    expect(state.offers).toEqual({
      offers: [],
      isLoading: false,
      city: 'Paris',
    });

    state = reducer(state, {
      type: ActionType.SET_USER,
      payload: mockUser,
    } as Action);

    expect(state.auth.user).toEqual(mockUser);

    state = reducer(state, {
      type: ActionType.SET_FAVORITE_COUNT,
      payload: 5,
    } as Action);

    expect(state.auth.favoriteCount).toBe(5);
  });

  it('should handle actions independently for offers and auth', () => {
    let state = reducer(undefined, {
      type: ActionType.CHANGE_CITY,
      payload: 'Cologne',
    } as Action);

    state = reducer(state, {
      type: ActionType.REQUIRE_AUTHORIZATION,
      payload: 'AUTH',
    } as Action);

    state = reducer(state, {
      type: ActionType.LOAD_OFFERS,
      payload: [mockOffer],
    } as Action);

    state = reducer(state, {
      type: ActionType.SET_USER,
      payload: mockUser,
    } as Action);

    expect(state.offers.city).toBe('Cologne');
    expect(state.offers.offers).toEqual([mockOffer]);
    expect(state.auth.authorizationStatus).toBe('AUTH');
    expect(state.auth.user).toEqual(mockUser);
  });

  it('should handle UPDATE_OFFER_FAVORITE action', () => {
    let state = reducer(undefined, {
      type: ActionType.LOAD_OFFERS,
      payload: [mockOffer],
    } as Action);

    state = reducer(state, {
      type: ActionType.UPDATE_OFFER_FAVORITE,
      payload: {
        offerId: '1',
        isFavorite: true,
      },
    } as Action);

    expect(state.offers.offers[0].isFavorite).toBe(true);
    expect(state.auth).toEqual({
      authorizationStatus: 'UNKNOWN',
      user: null,
      favoriteCount: 0,
    });
  });

  it('should not modify state for unknown actions', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN' } as Action);
    const action = { type: 'ANOTHER_UNKNOWN' } as Action;
    const result = reducer(initialState, action);
    expect(result).toBe(initialState);
  });
});

