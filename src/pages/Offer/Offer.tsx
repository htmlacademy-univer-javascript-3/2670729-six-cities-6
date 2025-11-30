import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getOfferById,
  getReviewsByOfferId,
  offers,
  cities,
  type Offer as OfferType,
  type Review,
} from '../../mocks';
import Stab404 from '../404';
import ReviewForm from '../../components/ReviewForm';
import ReviewsList from '../../components/ReviewsList';
import Map from '../../components/Map';
import OfferList from '../../components/OfferList';
import type { CardProps } from '../../components/Card/Card';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

type OfferProps = {
  isAuthorized: boolean;
};

const Offer: React.FC<OfferProps> = ({ isAuthorized }) => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferType | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      setOffer(getOfferById(Number(id)));
      setReviews(getReviewsByOfferId(Number(id)));
    }
  }, [id]);

  // Получаем данные для карты: текущее предложение + 3 ближайших
  const city = offer ? cities.find((c) => c.name === offer.city) : undefined;
  const nearOffers = offer
    ? offers
      .filter((o) => o.city === offer.city && o.id !== offer.id)
      .slice(0, 3)
    : [];
  const mapOffers = offer ? [offer, ...nearOffers] : [];

  // Преобразуем ближайшие предложения в формат CardProps
  const nearCards: CardProps[] = nearOffers.map((nearOffer) => ({
    id: nearOffer.id,
    mark: nearOffer.mark,
    priceValue: nearOffer.priceValue,
    priceText: nearOffer.priceText,
    name: nearOffer.name,
    type: nearOffer.type,
    rating: nearOffer.rating,
    image: nearOffer.images[0],
    isFavorite: nearOffer.isFavorite,
  }));

  return offer !== undefined ? (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/room.jpg"
                alt="Photo studio"
              />
            </div>
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/apartment-01.jpg"
                alt="Photo studio"
              />
            </div>
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/apartment-02.jpg"
                alt="Photo studio"
              />
            </div>
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/apartment-03.jpg"
                alt="Photo studio"
              />
            </div>
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/studio-01.jpg"
                alt="Photo studio"
              />
            </div>
            <div className="offer__image-wrapper">
              <img
                className="offer__image"
                src="img/apartment-01.jpg"
                alt="Photo studio"
              />
            </div>
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {offer.mark && (
              <div className="offer__mark">
                <span>{offer.mark}</span>
              </div>
            )}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">{offer.name}</h1>
              <button
                className={cn('offer__bookmark-button', 'button', {
                  'offer__bookmark-button--active': offer.isFavorite,
                })}
                type="button"
              >
                <svg className="offer__bookmark-icon" width="31" height="33">
                  <use xlinkHref="#icon-bookmark"></use>
                </svg>
                <span className="visually-hidden">
                  {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                </span>
              </button>
            </div>
            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{ width: `${offer.rating * 20}%` }}></span>
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="offer__rating-value rating__value">
                {offer.rating}
              </span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {offer.type}
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                {offer.bedrooms} Bedrooms
              </li>
              <li className="offer__feature offer__feature--adults">
                Max {offer.maxAdults} adults
              </li>
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">&euro;{offer.priceValue}</b>
              <span className="offer__price-text">&nbsp;{offer.priceText}</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {offer.goods.map((item) => (
                  <li key={item} className="offer__inside-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>
              <div className="offer__host-user user">
                <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                  <img
                    className="offer__avatar user__avatar"
                    src={offer.host.avatar}
                    width="74"
                    height="74"
                    alt="Host avatar"
                  />
                </div>
                <span className="offer__user-name">{offer.host.name}</span>
                {offer.host.isPro && (
                  <span className="offer__user-status">Pro</span>
                )}
              </div>
              <div className="offer__description">
                {offer.description.map((item) => (
                  <p key={item} className="offer__text">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <section className="offer__reviews reviews">
              <h2 className="reviews__title">
                {reviews.length > 0 ? (
                  <>
                    Reviews &middot;{' '}
                    <span className="reviews__amount">{reviews.length}</span>
                  </>
                ) : (
                  'There are no reviews here yet, be the first'
                )}
              </h2>
              {reviews.length > 0 && (
                <ReviewsList reviews={reviews} formatDate={formatDate} />
              )}
              {isAuthorized && <ReviewForm />}
            </section>
          </div>
        </div>
        {city && (
          <Map
            city={city}
            offers={mapOffers}
            selectedOffer={offer}
            className="offer__map map"
          />
        )}
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">
            Other places in the neighbourhood
          </h2>
          {nearCards.length > 0 && (
            <OfferList
              cards={nearCards.map((card) => ({
                ...card,
                cardClassName: 'near-places__card place-card',
                imageWrapperClassName:
                  'near-places__image-wrapper place-card__image-wrapper',
              }))}
              listClassName="near-places__list places__list"
            />
          )}
        </section>
      </div>
    </main>
  ) : (
    <Stab404 />
  );
};

export default Offer;
