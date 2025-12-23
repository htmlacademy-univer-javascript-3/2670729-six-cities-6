import { describe, it, expect } from 'vitest';
import { authReducer, type AuthState } from './reducer';
import { ActionType, type Action } from '../actions';
import type { AuthInfo } from '../../types';

const mockUser: AuthInfo = {
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'avatar.jpg',
  isPro: true,
};

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
  favoriteCount: 0,
};

describe('authReducer', () => {
  it('should return initial state when state is undefined', () => {
    const action = { type: 'UNKNOWN_ACTION' } as Action;
    const result = authReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should return current state for unknown action', () => {
    const currentState: AuthState = {
      authorizationStatus: 'AUTH',
      user: mockUser,
      favoriteCount: 5,
    };
    const action = { type: 'UNKNOWN_ACTION' } as Action;
    const result = authReducer(currentState, action);
    expect(result).toBe(currentState);
  });

  describe('REQUIRE_AUTHORIZATION', () => {
    it('should set authorization status to AUTH', () => {
      const action: Action = {
        type: ActionType.REQUIRE_AUTHORIZATION,
        payload: 'AUTH',
      };
      const result = authReducer(initialState, action);
      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toBe(initialState.user);
      expect(result.favoriteCount).toBe(initialState.favoriteCount);
    });

    it('should set authorization status to NO_AUTH', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 5,
      };
      const action: Action = {
        type: ActionType.REQUIRE_AUTHORIZATION,
        payload: 'NO_AUTH',
      };
      const result = authReducer(currentState, action);
      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBe(currentState.user);
      expect(result.favoriteCount).toBe(currentState.favoriteCount);
    });

    it('should set authorization status to UNKNOWN', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 5,
      };
      const action: Action = {
        type: ActionType.REQUIRE_AUTHORIZATION,
        payload: 'UNKNOWN',
      };
      const result = authReducer(currentState, action);
      expect(result.authorizationStatus).toBe('UNKNOWN');
    });
  });

  describe('SET_USER', () => {
    it('should set user', () => {
      const action: Action = {
        type: ActionType.SET_USER,
        payload: mockUser,
      };
      const result = authReducer(initialState, action);
      expect(result.user).toEqual(mockUser);
      expect(result.authorizationStatus).toBe(initialState.authorizationStatus);
      expect(result.favoriteCount).toBe(initialState.favoriteCount);
    });

    it('should set user to null', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 5,
      };
      const action: Action = {
        type: ActionType.SET_USER,
        payload: null,
      };
      const result = authReducer(currentState, action);
      expect(result.user).toBeNull();
      expect(result.authorizationStatus).toBe(currentState.authorizationStatus);
      expect(result.favoriteCount).toBe(currentState.favoriteCount);
    });

    it('should replace existing user', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 5,
      };
      const newUser: AuthInfo = {
        token: 'new-token',
        email: 'new@example.com',
        name: 'New User',
        avatarUrl: 'new-avatar.jpg',
        isPro: false,
      };
      const action: Action = {
        type: ActionType.SET_USER,
        payload: newUser,
      };
      const result = authReducer(currentState, action);
      expect(result.user).toEqual(newUser);
      expect(result.user?.email).toBe('new@example.com');
    });
  });

  describe('SET_FAVORITE_COUNT', () => {
    it('should set favorite count', () => {
      const action: Action = {
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 10,
      };
      const result = authReducer(initialState, action);
      expect(result.favoriteCount).toBe(10);
      expect(result.authorizationStatus).toBe(initialState.authorizationStatus);
      expect(result.user).toBe(initialState.user);
    });

    it('should set favorite count to zero', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 5,
      };
      const action: Action = {
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 0,
      };
      const result = authReducer(currentState, action);
      expect(result.favoriteCount).toBe(0);
    });

    it('should update favorite count', () => {
      const currentState: AuthState = {
        authorizationStatus: 'AUTH',
        user: mockUser,
        favoriteCount: 3,
      };
      const action: Action = {
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 7,
      };
      const result = authReducer(currentState, action);
      expect(result.favoriteCount).toBe(7);
    });
  });

  describe('Multiple actions', () => {
    it('should handle multiple actions in sequence', () => {
      let state = authReducer(initialState, {
        type: ActionType.REQUIRE_AUTHORIZATION,
        payload: 'AUTH',
      } as Action);
      state = authReducer(state, {
        type: ActionType.SET_USER,
        payload: mockUser,
      } as Action);
      state = authReducer(state, {
        type: ActionType.SET_FAVORITE_COUNT,
        payload: 5,
      } as Action);

      expect(state.authorizationStatus).toBe('AUTH');
      expect(state.user).toEqual(mockUser);
      expect(state.favoriteCount).toBe(5);
    });
  });
});

