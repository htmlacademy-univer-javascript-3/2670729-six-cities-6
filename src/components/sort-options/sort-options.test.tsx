import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortOptions, { type SortType } from './sort-options';

describe('SortOptions', () => {
  const mockOnSortChange = vi.fn();
  const defaultProps = {
    currentSort: 'Popular' as SortType,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render sort options component', () => {
    const { container } = render(<SortOptions {...defaultProps} />);
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveTextContent('Popular');
  });

  it('should display current sort option', () => {
    const { container } = render(<SortOptions currentSort="Price: low to high" onSortChange={mockOnSortChange} />);
    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveTextContent('Price: low to high');
  });

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions {...defaultProps} />);

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toBeInTheDocument();

    if (sortType) {
      await user.click(sortType);
      // Проверяем, что список открылся
      const optionsList = screen.getByRole('list');
      expect(optionsList).toHaveClass('places__options--opened');
    }
  });

  it('should close dropdown when clicked again', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions {...defaultProps} />);

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toBeInTheDocument();

    if (sortType) {
      // Открываем
      await user.click(sortType);
      expect(screen.getByRole('list')).toHaveClass('places__options--opened');

      // Закрываем
      await user.click(sortType);
      expect(screen.getByRole('list')).not.toHaveClass('places__options--opened');
    }
  });

  it('should call onSortChange when option is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions {...defaultProps} />);

    const sortType = container.querySelector('.places__sorting-type');
    if (sortType) {
      await user.click(sortType);

      const priceOption = screen.getAllByText('Price: low to high').find((el) => el.tagName === 'LI');
      expect(priceOption).toBeInTheDocument();

      if (priceOption) {
        await user.click(priceOption);
        expect(mockOnSortChange).toHaveBeenCalledWith('Price: low to high');
        expect(mockOnSortChange).toHaveBeenCalledTimes(1);
      }
    }
  });

  it('should close dropdown after selecting option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions {...defaultProps} />);

    const sortType = container.querySelector('.places__sorting-type');
    if (sortType) {
      await user.click(sortType);

      const priceOption = screen.getAllByText('Price: low to high').find((el) => el.tagName === 'LI');
      if (priceOption) {
        await user.click(priceOption);

        // Dropdown должен закрыться после выбора
        expect(screen.getByRole('list')).not.toHaveClass('places__options--opened');
      }
    }
  });

  it('should mark current sort option as active', () => {
    const { container } = render(<SortOptions currentSort="Top rated first" onSortChange={mockOnSortChange} />);

    const activeOption = container.querySelector('.places__option--active');
    expect(activeOption).toBeInTheDocument();
    expect(activeOption).toHaveTextContent('Top rated first');
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <div data-testid="outside">Outside</div>
        <SortOptions {...defaultProps} />
      </div>
    );

    const sortType = container.querySelector('.places__sorting-type');
    if (sortType) {
      await user.click(sortType);
      expect(screen.getByRole('list')).toHaveClass('places__options--opened');

      // Кликаем вне компонента
      const outside = screen.getByTestId('outside');
      await user.click(outside);

      // Dropdown должен закрыться
      expect(screen.getByRole('list')).not.toHaveClass('places__options--opened');
    }
  });

  it('should render all sort options', () => {
    render(<SortOptions {...defaultProps} />);

    const options = screen.getAllByRole('listitem');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Popular');
    expect(options[1]).toHaveTextContent('Price: low to high');
    expect(options[2]).toHaveTextContent('Price: high to low');
    expect(options[3]).toHaveTextContent('Top rated first');
  });
});


