import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyMainState from './empty-main-state';

describe('EmptyMainState', () => {
  it('should render empty state container', () => {
    const { container } = render(<EmptyMainState cityName="Paris" />);
    const emptyContainer = container.querySelector('.cities__places-container');
    expect(emptyContainer).toBeInTheDocument();
    expect(emptyContainer).toHaveClass('cities__places-container', 'cities__places-container--empty', 'container');
  });

  it('should render status message', () => {
    render(<EmptyMainState cityName="Paris" />);
    const status = screen.getByText('No places to stay available');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('cities__status');
  });

  it('should render description with city name', () => {
    render(<EmptyMainState cityName="Paris" />);
    const description = screen.getByText(/We could not find any property available at the moment in Paris/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('cities__status-description');
  });

  it('should render description with different city name', () => {
    render(<EmptyMainState cityName="Amsterdam" />);
    const description = screen.getByText(/We could not find any property available at the moment in Amsterdam/);
    expect(description).toBeInTheDocument();
  });
});

