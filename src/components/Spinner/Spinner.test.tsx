import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('should render spinner container', () => {
    const { container } = render(<Spinner />);
    const spinnerContainer = container.querySelector('.spinner-container');
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveClass('spinner-container');
  });

  it('should render spinner element', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct container styles', () => {
    const { container } = render(<Spinner />);
    const spinnerContainer = container.querySelector('.spinner-container');
    expect(spinnerContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      width: '100%',
    });
  });

  it('should have correct spinner styles', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveStyle({
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4481c3',
      borderRadius: '50%',
    });
  });
});

