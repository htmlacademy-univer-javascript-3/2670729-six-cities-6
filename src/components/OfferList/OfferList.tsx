import Card, { CardProps } from '../Card/Card';

type OfferListProps = {
  cards: CardProps[];
  onCardHover?: (id: number | null) => void;
  listClassName?: string;
};

const OfferList: React.FC<OfferListProps> = ({ cards, onCardHover, listClassName = 'cities__places-list places__list tabs__content' }) => {
  const handleCardHover = (id: number | null) => {
    onCardHover?.(id);
  };

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
};

export default OfferList;
