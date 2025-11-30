import { useState, useEffect } from 'react';
import type { CardProps } from '../../components/Card/Card';
import OfferList from '../../components/OfferList';
import type { Offer, City } from '../../mocks';
import Map from '../../components/Map';
import { Link, useSearchParams } from 'react-router-dom';

type MainProps = {
  offers: Offer[];
  cities: City[];
};

const Main: React.FC<MainProps> = ({ offers = [], cities = [] }) => {
  const [searchParams] = useSearchParams();
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const defaultCityId = 'amsterdam';
  const activeCityId = searchParams.get('city') || defaultCityId;

  const activeCity = cities.find((c) => c.id === activeCityId) || cities[0];

  // Сбрасываем активное предложение при смене города
  useEffect(() => {
    setActiveOfferId(null);
  }, [activeCityId]);

  const filteredOffers = offers.filter((offer) =>
    activeCity ? offer.city === activeCity.name : true
  );

  const quantity = filteredOffers.length;

  const selectedOffer = activeOfferId
    ? filteredOffers.find((offer) => offer.id === activeOfferId)
    : undefined;

  const cards: CardProps[] = filteredOffers.map((offer) => ({
    id: offer.id,
    mark: offer.mark,
    priceValue: offer.priceValue,
    priceText: offer.priceText,
    name: offer.name,
    type: offer.type,
    rating: offer.rating,
    image: offer.images[0],
    isFavorite: offer.isFavorite,
  }));

  const isEmpty = quantity === 0;

  return (
    <main
      className={[
        'page__main',
        'page__main--index',
        isEmpty ? 'page__main--index-empty' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            {cities.map((city) => (
              <li className="locations__item" key={city.id}>
                <Link
                  className={[
                    'locations__item-link',
                    'tabs__item',
                    city.id === activeCityId ? 'tabs__item--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  to={`/?city=${city.id}`}
                >
                  <span>{city.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="cities">
        {isEmpty ? (
          <div className="cities__places-container cities__places-container--empty container">
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">No places to stay available</b>
                <p className="cities__status-description">
                  We could not find any property available at the moment in{' '}
                  {activeCity?.name || ''}
                </p>
              </div>
            </section>
            <div className="cities__right-section"></div>
          </div>
        ) : (
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {quantity} places to stay in {activeCity?.name || ''}
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <OfferList cards={cards} onCardHover={setActiveOfferId} />
            </section>
            <div className="cities__right-section">
              <Map
                city={activeCity}
                offers={filteredOffers}
                selectedOffer={selectedOffer}
                className={'cities__map map'}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Main;
