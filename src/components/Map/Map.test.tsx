import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Map from './Map';
import type { City, Offer } from '../../types';

// Мокаем leaflet
vi.mock('leaflet', () => {
  const mockRemoveLayer = vi.fn();
  const mockSetIcon = vi.fn().mockReturnValue({
    addTo: vi.fn(),
  });
  const mockAddTo = vi.fn().mockReturnValue({
    removeLayer: mockRemoveLayer,
  });

  return {
    Icon: vi.fn().mockImplementation(() => ({})),
    Marker: vi.fn().mockImplementation(() => ({
      setIcon: mockSetIcon,
      addTo: mockAddTo,
    })),
    layerGroup: vi.fn().mockImplementation(() => ({
      addTo: mockAddTo,
    })),
  };
});

// Мокаем useMap хук
const mockMapInstance = {
  removeLayer: vi.fn(),
};

vi.mock('../../hooks/use-map', () => ({
  default: vi.fn(() => mockMapInstance),
}));

const mockCity: City = {
  id: '1',
  name: 'Paris',
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
};

const mockOffers: Offer[] = [
  {
    id: '1',
    mark: 'Premium',
    priceValue: '120',
    priceText: 'night',
    name: 'Test Offer 1',
    type: 'apartment',
    rating: 4.5,
    images: ['image1.jpg'],
    bedrooms: 2,
    maxAdults: 4,
    goods: ['Wi-Fi'],
    host: {
      name: 'John',
      avatar: 'avatar.jpg',
      isPro: true,
    },
    description: ['Description'],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    city: 'Paris',
    isFavorite: false,
  },
  {
    id: '2',
    mark: '',
    priceValue: '80',
    priceText: 'night',
    name: 'Test Offer 2',
    type: 'room',
    rating: 3.8,
    images: ['image2.jpg'],
    bedrooms: 1,
    maxAdults: 2,
    goods: ['TV'],
    host: {
      name: 'Jane',
      avatar: 'avatar2.jpg',
      isPro: false,
    },
    description: ['Description 2'],
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
    city: 'Paris',
    isFavorite: true,
  },
];

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty div when city is not provided', () => {
    const { container } = render(
      <Map city={undefined} offers={[]} className="test-class" />
    );

    const div = container.querySelector('div.test-class');
    expect(div).toBeInTheDocument();
    expect(div?.children.length).toBe(0);
  });

  it('should render map element when city is provided', () => {
    const { container } = render(
      <Map city={mockCity} offers={[]} className="test-class" />
    );

    const mapElement = container.querySelector('map.test-class');
    expect(mapElement).toBeInTheDocument();
  });

  it('should render map with correct className', () => {
    const customClassName = 'custom-map-class';
    const { container } = render(
      <Map city={mockCity} offers={[]} className={customClassName} />
    );

    const mapElement = container.querySelector(`map.${customClassName}`);
    expect(mapElement).toBeInTheDocument();
  });

  it('should render map without className when not provided', () => {
    const { container } = render(
      <Map city={mockCity} offers={[]} />
    );

    const mapElement = container.querySelector('map');
    expect(mapElement).toBeInTheDocument();
  });

  it('should render map when city and offers are provided', () => {
    const { container } = render(<Map city={mockCity} offers={mockOffers} />);

    const mapElement = container.querySelector('map');
    expect(mapElement).toBeInTheDocument();
  });

  it('should handle empty offers array', () => {
    const { container } = render(
      <Map city={mockCity} offers={[]} className="test-class" />
    );

    const mapElement = container.querySelector('map.test-class');
    expect(mapElement).toBeInTheDocument();
  });

  it('should handle selectedOffer prop', () => {
    const selectedOffer = mockOffers[0];
    const { container } = render(
      <Map
        city={mockCity}
        offers={mockOffers}
        selectedOffer={selectedOffer}
        className="test-class"
      />
    );

    const mapElement = container.querySelector('map.test-class');
    expect(mapElement).toBeInTheDocument();
  });

  it('should render map without selectedOffer', () => {
    const { container } = render(
      <Map city={mockCity} offers={mockOffers} className="test-class" />
    );

    const mapElement = container.querySelector('map.test-class');
    expect(mapElement).toBeInTheDocument();
  });
});

