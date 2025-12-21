import { combineReducers } from '@reduxjs/toolkit';
import { offersReducer } from './offers/reducer';
import { authReducer } from './auth/reducer';

export type { AuthorizationStatus } from './auth/reducer';

export const reducer = combineReducers({
  offers: offersReducer,
  auth: authReducer,
});

export type State = ReturnType<typeof reducer>;

