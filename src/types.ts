import type { CardProps } from './components/card/card';

export interface Offer {
  id: string;
  mark: string;
  priceValue: string;
  priceText: string;
  name: string;
  type: string;
  rating: number;
  images: string[];
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  host: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
  description: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
  isFavorite: boolean;
}

export interface Review {
  id: string;
  offerID: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface City {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  favoriteCount: number;
  favorites: string[];
}

export type DataType = {
  quantity: number;
  cards: CardProps[];
  offers: Offer[];
  reviews: Review[];
  cities: City[];
  user?: User;
};

export type Point = {
  title: string;
  lat: number;
  lng: number;
};

export type Points = Point[];

export interface AuthInfo {
  token: string;
  email: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
}
