import type { CardProps } from './components/Card/Card';
import type { Offer, Review, City, User } from './mocks';

export type DataType = {
  quantity: number;
  cards: CardProps[];
  offers: Offer[];
  reviews: Review[];
  cities: City[];
  user?: User;
};


