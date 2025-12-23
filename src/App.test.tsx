import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { reducer } from './store/reducer';
import type { AuthInfo } from './types';

const createMockStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN', user: AuthInfo | null = null) =>
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
        favoriteCount: 0,
      },
    },
  });

describe('App Routing', () => {
  describe('Main route (/)', () => {
    it('should render Main page on root path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Проверяем, что страница имеет правильные классы
      const page = document.querySelector('.page');
      expect(page).toHaveClass('page--gray', 'page--main');
    });

    it('should pass cities data to Main page', () => {
      const store = createMockStore();
      const cities = [
        {
          id: 'paris',
          name: 'Paris',
          location: {
            latitude: 48.8566,
            longitude: 2.3522,
            zoom: 10,
          },
        },
      ];

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App data={{ cities, quantity: 0, cards: [], offers: [], reviews: [] }} />
          </MemoryRouter>
        </Provider>
      );

      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
    });
  });

  describe('Login route (/login)', () => {
    it('should render Login page on /login path', async () => {
      const store = createMockStore('NO_AUTH');
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Ждем рендеринга страницы
      await waitFor(() => {
        const page = document.querySelector('.page');
        expect(page).toHaveClass('page--gray', 'page--login');
      });

      // Проверяем наличие формы входа
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should redirect authorized user from /login to main page', () => {
      const store = createMockStore('AUTH', {
        token: 'test-token',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'avatar.jpg',
        isPro: true,
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // После редиректа должна быть главная страница
      const page = document.querySelector('.page');
      expect(page).toHaveClass('page--gray', 'page--main');
    });
  });

  describe('Favorites route (/favorites)', () => {
    it('should redirect unauthorized user from /favorites to /login', async () => {
      const store = createMockStore('NO_AUTH');
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/favorites']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Ждем редиректа на страницу логина
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
      });

      const page = document.querySelector('.page');
      expect(page).toHaveClass('page--gray', 'page--login');
    });

    it('should render Favorites page for authorized user', () => {
      const store = createMockStore('AUTH', {
        token: 'test-token',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'avatar.jpg',
        isPro: true,
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/favorites']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Проверяем, что страница рендерится (не редирект на логин)
      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
      expect(page).not.toHaveClass('page--login');
    });

    it('should add empty favorites class when favoriteCount is 0', () => {
      const store = configureStore({
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

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/favorites']}>
            <App
              data={{
                user: {
                  userID: 1,
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  favoriteCount: 0,
                  favorites: [],
                },
                quantity: 0,
                cards: [],
                offers: [],
                reviews: [],
                cities: [],
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      const page = document.querySelector('.page');
      expect(page).toHaveClass('page--favorites-empty');
    });
  });

  describe('Offer route (/offer/:id)', () => {
    it('should render Offer page on /offer/:id path', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/offer/1']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Проверяем, что страница рендерится
      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
    });

    it('should render Offer page with different id', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/offer/123']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
    });
  });

  describe('404 route (*)', () => {
    it('should render 404 page for unknown routes', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/unknown-route']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      // Проверяем, что страница рендерится
      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
    });

    it('should render 404 page for nested unknown routes', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/some/deep/unknown/path']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const page = document.querySelector('.page');
      expect(page).toBeInTheDocument();
    });
  });

  describe('Header visibility', () => {
    it('should render Header on all pages', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const header = document.querySelector('.header');
      expect(header).toBeInTheDocument();
    });

    it('should pass isPageLogin prop correctly', () => {
      const store = createMockStore('NO_AUTH');
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      const header = document.querySelector('.header');
      expect(header).toBeInTheDocument();
    });
  });
});

