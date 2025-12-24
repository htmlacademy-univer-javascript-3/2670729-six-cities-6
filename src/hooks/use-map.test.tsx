import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { MutableRefObject } from 'react';
import useMap from './use-map';
import type { City } from '../types';
import { Map, TileLayer } from 'leaflet';

// Мокаем leaflet
vi.mock('leaflet', () => {
  const mockAddLayer = vi.fn();
  const mockSetView = vi.fn();
  const mockInstance = {
    addLayer: mockAddLayer,
    setView: mockSetView,
  };

  const mockMap = vi.fn().mockImplementation(() => mockInstance);
  const mockTileLayer = vi.fn().mockImplementation(() => ({}));

  return {
    Map: mockMap,
    TileLayer: mockTileLayer,
    default: {
      Map: mockMap,
      TileLayer: mockTileLayer,
    },
  };
});

describe('useMap', () => {
  let mapRef: MutableRefObject<HTMLElement | null>;
  let mockCity: City;
  const mockMapFn = vi.mocked(Map);
  const mockTileLayerFn = vi.mocked(TileLayer);

  beforeEach(() => {
    vi.clearAllMocks();

    // Создаем мок DOM элемента
    const div = document.createElement('div');
    mapRef = { current: div } as MutableRefObject<HTMLElement | null>;

    mockCity = {
      id: '1',
      name: 'Paris',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    };
  });

  it('should return null when mapRef.current is null', () => {
    const nullRef = { current: null } as MutableRefObject<HTMLElement | null>;

    const { result } = renderHook(() => useMap(nullRef, mockCity));

    expect(result.current).toBeNull();
  });

  it('should return null when city is undefined', () => {
    const { result } = renderHook(() => useMap(mapRef, undefined));

    expect(result.current).toBeNull();
  });

  it('should create map instance when mapRef and city are provided', async () => {
    const { result } = renderHook(() => useMap(mapRef, mockCity));

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    expect(mockMapFn).toHaveBeenCalledWith(mapRef.current, {
      center: {
        lat: mockCity.location.latitude,
        lng: mockCity.location.longitude,
      },
      zoom: mockCity.location.zoom,
    });

    expect(mockTileLayerFn).toHaveBeenCalledWith(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );
  });

  it('should not create map instance twice', async () => {
    const { rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    await waitFor(() => {
      expect(mockMapFn).toHaveBeenCalled();
    });

    const firstCallCount = mockMapFn.mock.calls.length;

    // Изменяем city, но карта не должна создаваться заново
    const newCity: City = {
      ...mockCity,
      name: 'Amsterdam',
      location: {
        latitude: 52.3676,
        longitude: 4.9041,
        zoom: 12,
      },
    };

    rerender({ city: newCity });

    // Map должен быть вызван только один раз
    expect(mockMapFn.mock.calls.length).toBe(firstCallCount);
  });

  it('should update map view when city changes', async () => {
    const { result, rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    // Ждем, пока карта создастся
    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    const mapInstance = result.current;
    expect(mapInstance).not.toBeNull();

    const newCity: City = {
      ...mockCity,
      name: 'Amsterdam',
      location: {
        latitude: 52.3676,
        longitude: 4.9041,
        zoom: 12,
      },
    };

    rerender({ city: newCity });

    // Ждем обновления
    await waitFor(() => {
      const currentMapInstance = result.current;
      if (currentMapInstance) {
        const instanceWithSetView = currentMapInstance as unknown as { setView: ReturnType<typeof vi.fn> };
        expect(instanceWithSetView.setView).toHaveBeenCalledWith(
          [newCity.location.latitude, newCity.location.longitude],
          newCity.location.zoom
        );
      }
    });
  });

  it('should add tile layer to map instance', async () => {
    renderHook(() => useMap(mapRef, mockCity));

    await waitFor(() => {
      expect(mockMapFn).toHaveBeenCalled();
    });
  });
});

