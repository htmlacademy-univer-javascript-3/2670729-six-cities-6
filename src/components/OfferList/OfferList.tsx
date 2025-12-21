import { memo, useCallback } from 'react';
import Card, { CardProps } from '../Card/Card';

type OfferListProps = {
  cards: CardProps[];
  onCardHover?: (id: string | null) => void;
  listClassName?: string;
};

const OfferList: React.FC<OfferListProps> = memo(({ cards, onCardHover, listClassName = 'cities__places-list places__list tabs__content' }) => {
  const handleCardHover = useCallback((id: string | null) => {
    onCardHover?.(id);
  }, [onCardHover]);

  return (
    <div className={listClassName}>
      {cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          onMouseEnter={() => handleCardHover(card.id)}
          onMouseLeave={() => handleCardHover(null)}
        />
      ))}
    </div>
  );
});

OfferList.displayName = 'OfferList';

export default OfferList;
