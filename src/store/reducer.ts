import type { Offer } from '../mocks';
import { ActionType, type Action } from './actions';

export interface State {
  city: string;
  offers: Offer[];
}

const initialState: State = {
  city: 'Paris',
  offers: [],
};

export const reducer = (state: State = initialState, action: Action): State => {
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
    default:
      return state;
  }
};

