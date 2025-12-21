import type { Offer } from '../../types';
import { ActionType, type Action } from '../actions';

export interface OffersState {
  offers: Offer[];
  isLoading: boolean;
  city: string;
}

const initialState: OffersState = {
  offers: [],
  isLoading: false,
  city: 'Paris',
};

export const offersReducer = (state: OffersState = initialState, action: Action): OffersState => {
  switch (action.type) {
    case ActionType.CHANGE_CITY:
      return {
        ...state,
        city: action.payload,
      };
    case ActionType.LOAD_OFFERS:
      return {
        ...state,
        offers: action.payload,
      };
    case ActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

