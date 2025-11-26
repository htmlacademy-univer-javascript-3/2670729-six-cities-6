import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import { getFavoriteOffers, type Offer } from '../../mocks';

type FavoritesProps = {
  favorites: number[];
};

const Favorites: React.FC<FavoritesProps> = ({ favorites }) => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Имитация запроса объектов по API
    setOffers(getFavoriteOffers(favorites));
  }, [favorites]);

  const groupedByCity: Record<string, Offer[]> = offers.reduce((acc, item) => {
    if (!acc[item.city]) {
      acc[item.city] = [];
    }
    acc[item.city].push(item);
    return acc;
  }, {} as Record<string, Offer[]>);

  return (
    <>
      <main className="page__main page__main--favorites page__main--favorites-empty">
        <div className="page__favorites-container container">
          {favorites.length <= 0 ? (
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
          ) : (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(groupedByCity).map(([city, cityItems]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityItems.map((item) => (
                        <article
                          key={item.id}
                          className="favorites__card place-card"
                        >
                          {item.mark && (
                            <div className="place-card__mark">
                              <span>{item.mark}</span>
                            </div>
                          )}
                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <a href="#">
                              <img
                                className="place-card__image"
                                src={item.images[item.images.length - 1]}
                                width="150"
                                height="110"
                                alt="Place image"
                              />
                            </a>
                          </div>
                          <div className="favorites__card-info place-card__info">
                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">
                                  &euro;{item.priceValue}
                                </b>
                                <span className="place-card__price-text">
                                  &#47;&nbsp;{item.priceText}
                                </span>
                              </div>
                              <button
                                className="place-card__bookmark-button place-card__bookmark-button--active button"
                                type="button"
                              >
                                <svg
                                  className="place-card__bookmark-icon"
                                  width="18"
                                  height="19"
                                >
                                  <use xlinkHref="#icon-bookmark"></use>
                                </svg>
                                <span className="visually-hidden">
                                  In bookmarks
                                </span>
                              </button>
                            </div>
                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{ width: '100%' }}></span>
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>
                            <h2 className="place-card__name">
                              <a href="#">{item.name}</a>
                            </h2>
                            <p className="place-card__type">{item.type}</p>
                          </div>
                        </article>
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
