import { Link } from 'react-router-dom';
import cn from 'classnames';

export type CardProps = {
  id: string;
  mark: string;
  priceValue: string;
  priceText: string;
  name: string;
  type: string;
  rating: number;
  image: string;
  isFavorite: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  cardClassName?: string;
  imageWrapperClassName?: string;
};

const Card: React.FC<CardProps> = ({
  id,
  mark,
  priceValue,
  priceText,
  name,
  type,
  rating,
  image,
  isFavorite,
  onMouseEnter,
  onMouseLeave,
  cardClassName = 'cities__card place-card',
  imageWrapperClassName = 'cities__image-wrapper place-card__image-wrapper',
}) => (
  <article
    className={cardClassName}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {mark && (
      <div className="place-card__mark">
        <span>{mark}</span>
      </div>
    )}
    <div className={imageWrapperClassName}>
      <Link to={`/offer/${id}`}>
        <img
          className="place-card__image"
          src={image}
          width="260"
          height="200"
          alt="Place image"
        />
      </Link>
    </div>
    <div className="place-card__info">
      <div className="place-card__price-wrapper">
        <div className="place-card__price">
          <b className="place-card__price-value">&euro;{priceValue} </b>
          <span className="place-card__price-text">&#47;&nbsp;{priceText}</span>
        </div>
        <button className={cn('place-card__bookmark-button', 'button', { 'place-card__bookmark-button--active': isFavorite })} type="button">
          <svg className="place-card__bookmark-icon" width="18" height="19">
            <use xlinkHref="#icon-bookmark"></use>
          </svg>
          <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks' }</span>
        </button>
      </div>
      <div className="place-card__rating rating">
        <div className="place-card__stars rating__stars">
          <span style={{ width: `${rating * 20}%` }}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <h2 className="place-card__name">
        <a href="#">{name}</a>
      </h2>
      <p className="place-card__type">{type}</p>
    </div>
  </article>
);

export default Card;
