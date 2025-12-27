import cn from 'classnames';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Offer as OfferType, Review, City } from '../../types';
import Stab404 from '../404';
import ReviewForm from '../../components/review-form';
import ReviewsList from '../../components/reviews-list';
import Map from '../../components/map';
import OfferList from '../../components/offer-list';
import type { CardProps } from '../../components/card/card';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchOfferById, fetchNearbyOffers, fetchReviews, toggleFavorite } from '../../store/actions';
import { getAuthorizationStatus } from '../../store/selectors';
import Spinner from '../../components/spinner';
import { formatHousingType } from '../../const';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Offer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [offer, setOffer] = useState<OfferType | undefined>(undefined);
  const [nearOffers, setNearOffers] = useState<OfferType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus === 'AUTH';

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsNotFound(false);

        const [offerData, nearbyData, reviewsData] = await Promise.all([
          dispatch(fetchOfferById(id)),
          dispatch(fetchNearbyOffers(id)),
          dispatch(fetchReviews(id)),
        ]);

        setOffer(offerData);
        setNearOffers(nearbyData);
        setReviews(reviewsData);
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setIsNotFound(true);
          }
        } else {
          setIsNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [id, dispatch]);

  // Получаем данные для карты: текущее предложение + 3 ближайших
  const city: City = useMemo(() => {
    if (!offer) {
      return {
        id: '',
        name: '',
        location: {
          latitude: 0,
          longitude: 0,
          zoom: 12
        }
      };
    }
    return {
      id: offer.city.toLowerCase(),
      name: offer.city,
      location: {
        latitude: offer.location.latitude,
        longitude: offer.location.longitude,
        zoom: 12
      }
    };
  }, [offer]);

  const limitedNearOffers = useMemo(
    () => nearOffers.slice(0, 3),
    [nearOffers]
  );

  const mapOffers = useMemo(
    () => offer ? [offer, ...limitedNearOffers] : limitedNearOffers,
    [offer, limitedNearOffers]
  );

  const nearCards: CardProps[] = useMemo(
    () => limitedNearOffers.map((nearOffer) => ({
      id: nearOffer.id,
      mark: nearOffer.mark,
      priceValue: nearOffer.priceValue,
      priceText: nearOffer.priceText,
      name: nearOffer.name,
      type: nearOffer.type,
      rating: nearOffer.rating,
      image: nearOffer.images[0],
      isFavorite: nearOffer.isFavorite,
    })),
    [limitedNearOffers]
  );

  const handleReviewAdded = useCallback(() => {
    if (id) {
      void dispatch(fetchReviews(id)).then((reviewsData) => {
        setReviews(reviewsData);
      });
    }
  }, [id, dispatch]);

  const handleFavoriteClick = useCallback(() => {
    if (!id || !offer) {
      return;
    }

    if (!isAuthorized) {
      navigate('/login');
      return;
    }

    void dispatch(toggleFavorite(id, !offer.isFavorite)).then(() => {
      setOffer((prevOffer) => {
        if (!prevOffer) {
          return prevOffer;
        }
        return { ...prevOffer, isFavorite: !prevOffer.isFavorite };
      });
    });
  }, [id, offer, isAuthorized, navigate, dispatch]);


  if (isNotFound) {
    return <Stab404 />;
  }

  if (isLoading || !offer) {
    return (
      <main className="page__main page__main--offer">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spinner />
        </div>
      </main>
    );
  }

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {offer.images.slice(0, 6).map((image, imageIndex) => (
              <div key={image} className="offer__image-wrapper">
                <img
                  className="offer__image"
                  src={image}
                  alt={`Photo ${imageIndex + 1}`}
                />
              </div>
            ))}
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
                onClick={handleFavoriteClick}
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
                <span style={{ width: `${Math.round(offer.rating) * 20}%` }}></span>
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="offer__rating-value rating__value">
                {offer.rating}
              </span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {formatHousingType(offer.type)}
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                {offer.bedrooms} {offer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </li>
              <li className="offer__feature offer__feature--adults">
                Max {offer.maxAdults} {offer.maxAdults === 1 ? 'adult' : 'adults'}
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
                <div
                  className={cn('offer__avatar-wrapper', 'user__avatar-wrapper', {
                    'offer__avatar-wrapper--pro': offer.host.isPro,
                  })}
                >
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
              {isAuthorized && (
                <ReviewForm
                  offerId={offer.id}
                  onReviewAdded={handleReviewAdded}
                />
              )}
            </section>
          </div>
        </div>
        <Map
          city={city}
          offers={mapOffers}
          selectedOffer={offer}
          className="offer__map map"
        />
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
  );
};

export default Offer;
