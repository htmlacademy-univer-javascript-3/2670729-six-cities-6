export const URL_MARKER_DEFAULT = '/img/pin.svg';

export const URL_MARKER_CURRENT = '/img/pin-active.svg';

export const formatHousingType = (type: string): string => {
  const typeMap: Record<string, string> = {
    apartment: 'Apartment',
    room: 'Room',
    house: 'House',
    hotel: 'Hotel',
  };
  return typeMap[type.toLowerCase()] || type;
};
