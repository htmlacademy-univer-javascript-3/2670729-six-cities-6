import type { AuthInfo } from '../../types';
import { ActionType, type Action } from '../actions';

export type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export interface AuthState {
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
}

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
};

export const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case ActionType.REQUIRE_AUTHORIZATION:
      return {
        ...state,
        authorizationStatus: action.payload,
      };
    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

