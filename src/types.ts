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

export type { Offer, City };

export type Point = {
  title: string;
  lat: number;
  lng: number;
};

export type Points = Point[];
