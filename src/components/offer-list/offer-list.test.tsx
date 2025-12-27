import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OfferList from './offer-list';
import type { CardProps } from '../card/card';
import { reducer } from '../../store/reducer';

const createMockStore = () =>
  configureStore({
    reducer,
    preloadedState: {
      offers: {
        city: 'Paris',
        offers: [],
        isLoading: false,
      },
      auth: {
        authorizationStatus: 'AUTH',
        user: {
          token: 'test-token',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: 'avatar.jpg',
          isPro: true,
        },
        favoriteCount: 0,
      },
    },
  });

const mockCards: CardProps[] = [
  {
    id: '1',
    mark: 'Premium',
    priceValue: '120',
    priceText: 'night',
    name: 'Test Offer 1',
    type: 'apartment',
    rating: 4.5,
    image: 'image1.jpg',
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
    image: 'image2.jpg',
    isFavorite: true,
  },
];

describe('OfferList', () => {
  it('should render list container', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={mockCards} />
        </MemoryRouter>
      </Provider>
    );

    const listContainer = container.querySelector('.cities__places-list');
    expect(listContainer).toBeInTheDocument();
  });

  it('should render all cards', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={mockCards} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument();
  });

  it('should use custom list className when provided', () => {
    const store = createMockStore();
    const customClassName = 'custom-list-class';
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={mockCards} listClassName={customClassName} />
        </MemoryRouter>
      </Provider>
    );

    const listContainer = container.querySelector(`.${customClassName}`);
    expect(listContainer).toBeInTheDocument();
  });

  it('should call onCardHover when card is hovered', () => {
    const store = createMockStore();
    const onCardHover = vi.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={mockCards} onCardHover={onCardHover} />
        </MemoryRouter>
      </Provider>
    );

    const card1 = screen.getByText('Test Offer 1').closest('article');
    expect(card1).toBeInTheDocument();

    // Симулируем hover события через fireEvent
    if (card1) {
      fireEvent.mouseEnter(card1);
      expect(onCardHover).toHaveBeenCalledWith('1');
      expect(onCardHover).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(card1);
      expect(onCardHover).toHaveBeenCalledWith(null);
      expect(onCardHover).toHaveBeenCalledTimes(2);
    }
  });

  it('should handle empty cards array', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={[]} />
        </MemoryRouter>
      </Provider>
    );

    const listContainer = container.querySelector('.cities__places-list');
    expect(listContainer).toBeInTheDocument();
    expect(screen.queryByText('Test Offer 1')).not.toBeInTheDocument();
  });

  it('should not call onCardHover if not provided', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferList cards={mockCards} />
        </MemoryRouter>
      </Provider>
    );

    const card1 = screen.getByText('Test Offer 1').closest('article');
    expect(card1).toBeInTheDocument();

    // Компонент должен рендериться без ошибок даже без onCardHover
    expect(card1).toBeInTheDocument();
  });
});

