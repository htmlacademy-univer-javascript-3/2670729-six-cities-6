import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from './private-route';
import { reducer } from '../../store/reducer';

// Мокируем Navigate для проверки пропсов
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  const NavigateMock = ({ to, replace, state }: { to: string; replace?: boolean; state?: unknown }) => (
    <div data-testid="navigate" data-to={to} data-replace={String(replace)} data-state={JSON.stringify(state)} />
  );
  return {
    ...actual,
    Navigate: NavigateMock,
  };
});

const createMockStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN') =>
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

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when user is authorized', () => {
    const store = createMockStore('AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when user is not authorized', () => {
    const store = createMockStore('NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    // Проверяем, что children не рендерится при редиректе
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

    // Проверяем, что Navigate рендерится
    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute('data-to')).toBe('/login');
    expect(navigate.getAttribute('data-replace')).toBe('true');
  });

  it('should redirect to login with location state when user is not authorized', () => {
    const store = createMockStore('NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    const navigate = screen.getByTestId('navigate');
    const stateAttr = navigate.getAttribute('data-state') || '{}';
    const state = JSON.parse(stateAttr) as { from?: { pathname?: string } };

    // Проверяем, что location передается в state
    expect(state).toHaveProperty('from');
    expect(state.from?.pathname).toBe('/favorites');
  });

  it('should handle UNKNOWN authorization status', () => {
    const store = createMockStore('UNKNOWN');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    // UNKNOWN статус не обрабатывается как NO_AUTH, поэтому children рендерится
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children only when authorization status is AUTH', () => {
    const store = createMockStore('AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div data-testid="protected">Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    // Проверяем, что children рендерится только при AUTH
    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    // Проверяем, что Navigate не рендерится при AUTH
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should not redirect when authorization status is AUTH', () => {
    const store = createMockStore('AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <PrivateRoute>
            <div data-testid="content">Protected Content</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});

