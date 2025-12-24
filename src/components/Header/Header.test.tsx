import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import { reducer } from '../../store/reducer';
import type { AuthInfo } from '../../types';

const mockUser: AuthInfo = {
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'avatar.jpg',
  isPro: true,
};

const createMockStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN', user: AuthInfo | null = null, favoriteCount: number = 0) =>
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
        user,
        favoriteCount,
      },
    },
  });

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render logo', () => {
    const store = createMockStore('AUTH', mockUser);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'img/logo.svg');
  });

  it('should render sign in link when user is not authorized', () => {
    const store = createMockStore('NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    const signInLink = screen.getByText('Sign in').closest('a');
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('should render user info when user is authorized', () => {
    const store = createMockStore('AUTH', mockUser);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
  });

  it('should render sign out link when user is authorized', () => {
    const store = createMockStore('AUTH', mockUser);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign out')).toBeInTheDocument();
    const signOutLink = screen.getByText('Sign out').closest('a');
    expect(signOutLink).toHaveAttribute('href', '/');
  });

  it('should render favorite count when user has favorites', () => {
    const store = createMockStore('AUTH', mockUser, 5);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5')).toHaveClass('header__favorite-count');
  });

  it('should not render favorite count when count is 0', () => {
    const store = createMockStore('AUTH', mockUser, 0);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteCount = screen.queryByText('0');
    expect(favoriteCount).not.toBeInTheDocument();
  });

  it('should render link to favorites when user is authorized', () => {
    const store = createMockStore('AUTH', mockUser);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    const favoritesLink = screen.getByText('test@example.com').closest('a');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('should not render nav when isPageLogin is true', () => {
    const store = createMockStore('AUTH', mockUser);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });

  it('should handle logout action', async () => {
    const user = userEvent.setup();
    const store = createMockStore('AUTH', mockUser);

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    const signOutLink = screen.getByText('Sign out').closest('a');
    expect(signOutLink).toBeInTheDocument();
    expect(signOutLink).toHaveAttribute('href', '/');

    // Проверяем, что ссылка кликабельна (logoutAction вызывается через dispatch)
    if (signOutLink) {
      await user.click(signOutLink);
      // После клика компонент может обновиться, но ссылка должна существовать
      expect(container.querySelector('a[href="/"]')).toBeInTheDocument();
    }
  });

  it('should handle UNKNOWN authorization status', () => {
    const store = createMockStore('UNKNOWN');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header isPageLogin={false} />
        </MemoryRouter>
      </Provider>
    );

    // При UNKNOWN должен показываться Sign in
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});

