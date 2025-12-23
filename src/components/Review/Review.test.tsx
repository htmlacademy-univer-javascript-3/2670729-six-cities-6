import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Review from './Review';
import type { Review as ReviewType } from '../../types';

const mockReview: ReviewType = {
  id: '1',
  offerID: '1',
  user: {
    name: 'John Doe',
    avatar: 'avatar.jpg',
  },
  rating: 4.5,
  comment: 'Great place to stay!',
  date: '2024-01-01T00:00:00.000Z',
};

describe('Review', () => {
  it('should render review item', () => {
    render(<Review review={mockReview} formattedDate="January 2024" />);
    const reviewItem = screen.getByRole('listitem');
    expect(reviewItem).toBeInTheDocument();
    expect(reviewItem).toHaveClass('reviews__item');
  });

  it('should render user avatar', () => {
    render(<Review review={mockReview} formattedDate="January 2024" />);
    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('reviews__avatar', 'user__avatar');
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
    expect(avatar).toHaveAttribute('width', '54');
    expect(avatar).toHaveAttribute('height', '54');
  });

  it('should render user name', () => {
    render(<Review review={mockReview} formattedDate="January 2024" />);
    const userName = screen.getByText('John Doe');
    expect(userName).toBeInTheDocument();
    expect(userName).toHaveClass('reviews__user-name');
  });

  it('should render rating', () => {
    const { container } = render(<Review review={mockReview} formattedDate="January 2024" />);
    const rating = container.querySelector('.reviews__rating');
    expect(rating).toBeInTheDocument();
    const stars = container.querySelector('.reviews__stars');
    expect(stars).toBeInTheDocument();
  });

  it('should render rating width based on rating value', () => {
    const { container } = render(<Review review={mockReview} formattedDate="January 2024" />);
    const ratingSpan = container.querySelector('.reviews__stars span[style]');
    expect(ratingSpan).toHaveStyle({ width: '90%' }); // 4.5 * 20 = 90
  });

  it('should render comment', () => {
    render(<Review review={mockReview} formattedDate="January 2024" />);
    const comment = screen.getByText('Great place to stay!');
    expect(comment).toBeInTheDocument();
    expect(comment).toHaveClass('reviews__text');
  });

  it('should render formatted date', () => {
    render(<Review review={mockReview} formattedDate="January 2024" />);
    const date = screen.getByText('January 2024');
    expect(date).toBeInTheDocument();
    expect(date).toHaveClass('reviews__time');
    expect(date).toHaveAttribute('dateTime', '2024-01-01T00:00:00.000Z');
  });
});

