import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });

  it('should render logo link', () => {
    render(<Footer />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('footer__logo-link');
    expect(link).toHaveAttribute('href', 'main.html');
  });

  it('should render logo image', () => {
    render(<Footer />);
    const image = screen.getByAltText('6 cities logo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('footer__logo');
    expect(image).toHaveAttribute('src', 'img/logo.svg');
    expect(image).toHaveAttribute('width', '64');
    expect(image).toHaveAttribute('height', '33');
  });
});

