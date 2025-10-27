import { useState } from 'react';
import Card, { CardProps } from '../Card/Card';

type OfferListProps = {
  cards: CardProps[];
  onCardHover?: (id: number | null) => void;
};

const OfferList: React.FC<OfferListProps> = ({ cards, onCardHover }) => {
  const [activeOffer, setActiveOffer] = useState<number | null>(null);

  const handleCardHover = (id: number | null) => {
    setActiveOffer(id);
    onCardHover?.(id);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          onMouseEnter={() => handleCardHover(card.id)}
          onMouseLeave={() => handleCardHover(null)}
        />
      ))}
      {
        // Временное отображение активной карточки
        activeOffer && (
          <div className="active-offer-indicator">
            Active offer ID: {activeOffer}
          </div>
        )
      }
    </div>
  );
};

export default OfferList;
