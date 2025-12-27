import { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchFavorites } from '../../store/actions';
import { getAuthorizationStatus, getFavoriteCount } from '../../store/selectors';
import Footer from '../../components/footer';
import Card from '../../components/card';
import type { Offer } from '../../types';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const favoriteCount = useAppSelector(getFavoriteCount);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevFavoriteCountRef = useRef(favoriteCount);

  useEffect(() => {
    if (authorizationStatus === 'AUTH') {
      setIsLoading(true);
      dispatch(fetchFavorites())
        .then((favoriteOffers) => {
          setOffers(favoriteOffers);
          setIsLoading(false);
          prevFavoriteCountRef.current = favoriteOffers.length;
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, authorizationStatus]);

  // Перезагружаем favorites при изменении favoriteCount
  useEffect(() => {
    if (authorizationStatus === 'AUTH' && !isLoading && prevFavoriteCountRef.current !== favoriteCount) {
      dispatch(fetchFavorites())
        .then((favoriteOffers) => {
          setOffers(favoriteOffers);
          prevFavoriteCountRef.current = favoriteOffers.length;
        })
        .catch(() => {
          // Игнорируем ошибки при перезагрузке
        });
    }
  }, [dispatch, authorizationStatus, isLoading, favoriteCount]);

  const groupedByCity: Record<string, Offer[]> = useMemo(
    () => offers.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = [];
      }
      acc[item.city].push(item);
      return acc;
    }, {} as Record<string, Offer[]>),
    [offers]
  );

  const isEmpty = !isLoading && offers.length === 0;
  const hasOffers = !isLoading && offers.length > 0;

  return (
    <>
      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {isLoading && (
            <section className="favorites">
              <h1 className="visually-hidden">Favorites</h1>
              <p>Loading...</p>
            </section>
          )}
          {isEmpty && (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future
                  trips.
                </p>
              </div>
            </section>
          )}
          {hasOffers && (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(groupedByCity).map(([city, cityItems]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to={`/?city=${city.toLowerCase()}`}>
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityItems.map((item) => (
                        <Card
                          key={item.id}
                          id={item.id}
                          mark={item.mark}
                          priceValue={item.priceValue}
                          priceText={item.priceText}
                          name={item.name}
                          type={item.type}
                          rating={Math.round(item.rating)}
                          image={item.images[0] || ''}
                          isFavorite={item.isFavorite}
                          cardClassName="favorites__card place-card"
                          imageWrapperClassName="favorites__image-wrapper place-card__image-wrapper"
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Favorites;
