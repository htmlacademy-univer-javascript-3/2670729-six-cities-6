export interface Offer {
  id: number;
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
  isFavorite: boolean; // TODO delete
}

export const offers: Offer[] = [
  {
    id: 1,
    mark: 'Premium',
    priceValue: '120',
    priceText: 'night',
    name: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    rating: 4.8,
    images: [
      'img/apartment-01.jpg',
    ],
    bedrooms: 3,
    maxAdults: 4,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
      'Kitchen',
      'Dishwasher',
      'Cable TV',
      'Fridge'
    ],
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: [
      'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
      'An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.'
    ],
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198
    },
    city: 'Amsterdam',
    isFavorite: false
  },
  {
    id: 2,
    mark: '',
    priceValue: '80',
    priceText: 'night',
    name: 'Wood and stone place',
    type: 'Room',
    rating: 4.0,
    images: [
      'img/room.jpg',
      'img/room-small.jpg',
    ],
    bedrooms: 1,
    maxAdults: 2,
    goods: [
      'Wi-Fi',
      'Heating',
      'Kitchen',
      'Fridge'
    ],
    host: {
      name: 'Max',
      avatar: 'img/avatar-max.jpg',
      isPro: false
    },
    description: [
      'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.'
    ],
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198
    },
    city: 'Amsterdam',
    isFavorite: true
  },
  {
    id: 3,
    mark: '',
    priceValue: '132',
    priceText: 'night',
    name: 'Canal View Prinsengracht',
    type: 'Apartment',
    rating: 4.2,
    images: [
      'img/apartment-02.jpg',
      'img/apartment-01.jpg',
      'img/apartment-03.jpg'
    ],
    bedrooms: 2,
    maxAdults: 3,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Kitchen',
      'Dishwasher',
      'Fridge'
    ],
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: [
      'Beautiful canal view apartment in the heart of Amsterdam with modern amenities and traditional charm.'
    ],
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198
    },
    city: 'Amsterdam',
    isFavorite: false
  },
  {
    id: 4,
    mark: 'Premium',
    priceValue: '180',
    priceText: 'night',
    name: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    rating: 5.0,
    images: [
      'img/apartment-03.jpg',
      'img/apartment-small-03.jpg',
    ],
    bedrooms: 4,
    maxAdults: 6,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Dishwasher',
      'Cable TV',
      'Fridge',
      'Air conditioning'
    ],
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: [
      'Spacious and luxurious apartment with premium amenities and stunning city views.',
      'Perfect for families or groups looking for comfort and style in the heart of Amsterdam.'
    ],
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198
    },
    city: 'Amsterdam',
    isFavorite: false
  },
  {
    id: 5,
    mark: '',
    priceValue: '180',
    priceText: 'night',
    name: 'White castle',
    type: 'Apartment',
    rating: 5.0,
    images: [
      'img/apartment-small-04.jpg',
    ],
    bedrooms: 4,
    maxAdults: 6,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Dishwasher',
      'Cable TV',
      'Fridge',
      'Air conditioning'
    ],
    host: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: [
      'Spacious and luxurious apartment with premium amenities and stunning city views.',
      'Perfect for families or groups looking for comfort and style in the heart of Amsterdam.'
    ],
    location: {
      latitude: 50.9339553943508,
      longitude: 6.956309666406198
    },
    city: 'Cologne',
    isFavorite: false
  }
];

export const getFavoriteOffers = (favorites: number[]) => (
  offers.filter((offer) => favorites.includes(offer.id))
);

export const getOfferById = (id:number): Offer | undefined => (offers.find((item) => item.id === id));
