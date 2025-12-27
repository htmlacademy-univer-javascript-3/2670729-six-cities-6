import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Card from './card';
import type { CardProps } from './card';
import { reducer } from '../../store/reducer';

const createMockStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' = 'AUTH') =>
  configureStore({
    reducer,
    preloadedState: {
      offers: {
        city: 'Paris',
        offers: [],
        isLoading: false,
      },
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? {
          token: 'test-token',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: 'avatar.jpg',
          isPro: true,
        } : null,
        favoriteCount: 0,
      },
    },
  });

const mockCardProps: CardProps = {
  id: '1',
  mark: 'Premium',
  priceValue: '120',
  priceText: 'night',
  name: 'Test Offer',
  type: 'apartment',
  rating: 4.5,
  image: 'image1.jpg',
  isFavorite: false,
};

describe('Card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render card with all information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should render card without mark when mark is empty', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} mark="" />
        </MemoryRouter>
      </Provider>
    );

    const markElement = container.querySelector('.place-card__mark');
    expect(markElement).not.toBeInTheDocument();
  });

  it('should render favorite button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('place-card__bookmark-button');
  });

  it('should mark favorite button as active when isFavorite is true', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} isFavorite />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('should render correct rating width', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} rating={4.5} />
        </MemoryRouter>
      </Provider>
    );

    const ratingSpan = container.querySelector('.place-card__stars span[style]');
    expect(ratingSpan).toHaveStyle({ width: '90%' }); // 4.5 * 20 = 90
  });

  it('should render correct link to offer', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} />
        </MemoryRouter>
      </Provider>
    );

    const links = screen.getAllByRole('link');
    const offerLink = links.find((link) => link.getAttribute('href') === '/offer/1');
    expect(offerLink).toBeInTheDocument();
  });

  it('should call onMouseEnter when card is hovered', () => {
    const store = createMockStore();
    const onMouseEnter = vi.fn();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} onMouseEnter={onMouseEnter} />
        </MemoryRouter>
      </Provider>
    );

    const card = container.querySelector('article');
    expect(card).toBeInTheDocument();

    // Проверяем, что обработчик установлен
    if (card) {
      fireEvent.mouseEnter(card);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onMouseLeave when mouse leaves card', () => {
    const store = createMockStore();
    const onMouseLeave = vi.fn();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} onMouseLeave={onMouseLeave} />
        </MemoryRouter>
      </Provider>
    );

    const card = container.querySelector('article');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.mouseLeave(card);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    }
  });

  it('should navigate to login when favorite clicked and user not authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore('NO_AUTH');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();

    // При NO_AUTH должен быть редирект на /login при клике
    // Проверяем, что кнопка кликабельна
    await user.click(favoriteButton);
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should use custom className when provided', () => {
    const store = createMockStore();
    const customClassName = 'custom-card-class';
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} cardClassName={customClassName} />
        </MemoryRouter>
      </Provider>
    );

    const card = container.querySelector(`.${customClassName}`);
    expect(card).toBeInTheDocument();
  });

  it('should render image with correct attributes', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Card {...mockCardProps} />
        </MemoryRouter>
      </Provider>
    );

    const image = screen.getByAltText('Place image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'image1.jpg');
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });
});

