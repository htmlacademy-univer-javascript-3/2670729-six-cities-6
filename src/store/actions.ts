import type { Offer } from '../mocks';

export const ActionType = {
  CHANGE_CITY: 'CHANGE_CITY',
  LOAD_OFFERS: 'LOAD_OFFERS',
} as const;

export interface ChangeCityAction {
  type: typeof ActionType.CHANGE_CITY;
  payload: string;
}

export interface LoadOffersAction {
  type: typeof ActionType.LOAD_OFFERS;
  payload: Offer[];
}

export type Action = ChangeCityAction | LoadOffersAction;

export const changeCity = (city: string): ChangeCityAction => ({
  type: ActionType.CHANGE_CITY,
  payload: city,
});

export const loadOffers = (offers: Offer[]): LoadOffersAction => ({
  type: ActionType.LOAD_OFFERS,
  payload: offers,
});

