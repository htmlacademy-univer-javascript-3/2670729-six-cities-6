import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CitiesList from './cities-list';
import type { City } from '../../types';

const mockCities: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  {
    id: 'cologne',
    name: 'Cologne',
    location: {
      latitude: 50.9375,
      longitude: 6.9603,
      zoom: 10,
    },
  },
  {
    id: 'brussels',
    name: 'Brussels',
    location: {
      latitude: 50.8503,
      longitude: 4.3517,
      zoom: 10,
    },
  },
];

describe('CitiesList', () => {
  it('should render cities list container', () => {
    const { container } = render(
      <MemoryRouter>
        <CitiesList cities={mockCities} activeCityId="paris" />
      </MemoryRouter>
    );
    const tabsContainer = container.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
    expect(tabsContainer).toHaveClass('tabs');
  });

  it('should render all cities', () => {
    render(
      <MemoryRouter>
        <CitiesList cities={mockCities} activeCityId="paris" />
      </MemoryRouter>
    );
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Brussels')).toBeInTheDocument();
  });

  it('should mark active city', () => {
    render(
      <MemoryRouter>
        <CitiesList cities={mockCities} activeCityId="paris" />
      </MemoryRouter>
    );
    const parisLink = screen.getByText('Paris').closest('a');
    expect(parisLink).toHaveClass('tabs__item--active');
  });

  it('should not mark inactive cities', () => {
    render(
      <MemoryRouter>
        <CitiesList cities={mockCities} activeCityId="paris" />
      </MemoryRouter>
    );
    const cologneLink = screen.getByText('Cologne').closest('a');
    const brusselsLink = screen.getByText('Brussels').closest('a');
    expect(cologneLink).not.toHaveClass('tabs__item--active');
    expect(brusselsLink).not.toHaveClass('tabs__item--active');
  });

  it('should render correct links', () => {
    render(
      <MemoryRouter>
        <CitiesList cities={mockCities} activeCityId="paris" />
      </MemoryRouter>
    );
    const parisLink = screen.getByText('Paris').closest('a');
    const cologneLink = screen.getByText('Cologne').closest('a');
    expect(parisLink).toHaveAttribute('href', '/?city=paris');
    expect(cologneLink).toHaveAttribute('href', '/?city=cologne');
  });

  it('should handle empty cities array', () => {
    const { container } = render(
      <MemoryRouter>
        <CitiesList cities={[]} activeCityId="" />
      </MemoryRouter>
    );
    const tabsContainer = container.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

