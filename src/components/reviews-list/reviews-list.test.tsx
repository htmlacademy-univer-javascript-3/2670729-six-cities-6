import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsList from './reviews-list';
import type { Review } from '../../types';

const mockReviews: Review[] = [
  {
    id: '1',
    offerID: '1',
    user: {
      name: 'John Doe',
      avatar: 'avatar1.jpg',
    },
    rating: 4.5,
    comment: 'Great place!',
    date: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    offerID: '1',
    user: {
      name: 'Jane Smith',
      avatar: 'avatar2.jpg',
    },
    rating: 5,
    comment: 'Amazing experience!',
    date: '2024-01-02T00:00:00.000Z',
  },
];

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

describe('ReviewsList', () => {
  it('should render reviews list', () => {
    render(<ReviewsList reviews={mockReviews} formatDate={formatDate} />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('reviews__list');
  });

  it('should render all reviews', () => {
    render(<ReviewsList reviews={mockReviews} formatDate={formatDate} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('should render review content', () => {
    render(<ReviewsList reviews={mockReviews} formatDate={formatDate} />);
    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Amazing experience!')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should return null when reviews array is empty', () => {
    const { container } = render(<ReviewsList reviews={[]} formatDate={formatDate} />);
    expect(container.firstChild).toBeNull();
  });

  it('should call formatDate for each review', () => {
    const formatDateSpy = vi.fn((dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    );

    render(<ReviewsList reviews={mockReviews} formatDate={formatDateSpy} />);
    expect(formatDateSpy).toHaveBeenCalledTimes(2);
    expect(formatDateSpy).toHaveBeenCalledWith('2024-01-01T00:00:00.000Z');
    expect(formatDateSpy).toHaveBeenCalledWith('2024-01-02T00:00:00.000Z');
  });
});

