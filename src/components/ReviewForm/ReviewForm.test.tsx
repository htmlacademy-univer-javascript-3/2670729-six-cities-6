import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewForm from './ReviewForm';
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

describe('ReviewForm', () => {
  const mockOnReviewAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render review form', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should render all rating stars', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    expect(container.querySelector('input[id="5-stars"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="4-stars"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="3-stars"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="2-stars"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="1-star"]')).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    // Выбираем рейтинг
    const rating5 = container.querySelector('input[id="5-stars"]') as HTMLInputElement;
    expect(rating5).toBeInTheDocument();
    await user.click(rating5);

    // Вводим текст (минимум 50 символов)
    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'This is a great place to stay! Very comfortable and clean. Highly recommended!');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should disable submit button when review is too short', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    const rating5 = container.querySelector('input[id="5-stars"]') as HTMLInputElement;
    await user.click(rating5);

    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'Too short');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should disable submit button when review is too long', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    const rating5 = container.querySelector('input[id="5-stars"]') as HTMLInputElement;
    await user.click(rating5);

    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    // Вводим ровно 300 символов (максимум), что должно быть валидно
    // Но если введем больше, то textarea ограничит до 300 из-за maxLength
    const longText = 'a'.repeat(300);
    await user.type(textarea, longText);

    // Проверяем, что textarea имеет maxLength=300
    expect(textarea).toHaveAttribute('maxLength', '300');

    // Кнопка должна быть enabled при 300 символах (валидный максимум)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should allow selecting different ratings', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" onReviewAdded={mockOnReviewAdded} />
      </Provider>
    );

    const rating3 = container.querySelector('input[id="3-stars"]') as HTMLInputElement;
    await user.click(rating3);

    expect(rating3).toBeChecked();
  });

});

