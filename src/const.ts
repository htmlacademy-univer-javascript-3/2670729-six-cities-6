export const URL_MARKER_DEFAULT = '/img/pin.svg';

export const URL_MARKER_CURRENT = '/img/pin-active.svg';

export const ReviewLength = {
  MIN: 50,
  MAX: 300,
} as const;

export const ReviewRating = {
  MIN: 1,
  MAX: 5,
} as const;

export const ReviewsLimit = {
  MAX: 10,
} as const;

export const OfferImages = {
  MAX: 6,
} as const;

export const NearbyOffers = {
  MAX: 3,
} as const;

export const MapZoom = {
  DEFAULT: 12,
} as const;

export const RatingDisplay = {
  PERCENTAGE_MULTIPLIER: 20,
  MAX_STARS: 5,
} as const;

export const formatHousingType = (type: string): string => {
  const typeMap: Record<string, string> = {
    apartment: 'Apartment',
    room: 'Room',
    house: 'House',
    hotel: 'Hotel',
  };
  return typeMap[type.toLowerCase()] || type;
};
