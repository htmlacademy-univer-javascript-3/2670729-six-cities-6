import { useState, useRef, useEffect } from 'react';

export type SortType = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

type SortOptionsProps = {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
};

const SortOptions: React.FC<SortOptionsProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortRef = useRef<HTMLFormElement>(null);

  const sortOptions: SortType[] = [
    'Popular',
    'Price: low to high',
    'Price: high to low',
    'Top rated first',
  ];

  const handleOptionClick = (option: SortType) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Закрываем список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <form
      className="places__sorting"
      action="#"
      method="get"
      ref={sortRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0}>
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {sortOptions.map((option) => (
          <li
            key={option}
            className={`places__option ${
              option === currentSort ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default SortOptions;

