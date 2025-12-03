import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { CardProps } from '../../components/Card/Card';
import OfferList from '../../components/OfferList';
import CitiesList from '../../components/CitiesList';
import type { City } from '../../mocks';
import Map from '../../components/Map';
import { useSearchParams } from 'react-router-dom';
import { getOffersByCity } from '../../store/selectors';
import { changeCity } from '../../store/actions';

type MainProps = {
  cities: City[];
};

const Main: React.FC<MainProps> = ({ cities = [] }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const defaultCityId = 'paris';
  const activeCityId = searchParams.get('city') || defaultCityId;

  const activeCity = cities.find((c) => c.id === activeCityId) || cities.find((c) => c.id === 'paris') || cities[0];

  // Синхронизируем выбор города из URL с Redux store
  useEffect(() => {
    if (activeCity) {
      dispatch(changeCity(activeCity.name));
    }
  }, [activeCityId, activeCity, dispatch]);

  // Получаем отфильтрованные предложения из Redux store
  const filteredOffers = useSelector(getOffersByCity);

  // Сбрасываем активное предложение при смене города
  useEffect(() => {
    setActiveOfferId(null);
  }, [activeCityId]);

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
      <CitiesList cities={cities} activeCityId={activeCityId} />
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
