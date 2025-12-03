import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { CardProps } from '../../components/Card/Card';
import OfferList from '../../components/OfferList';
import CitiesList from '../../components/CitiesList';
import SortOptions, { type SortType } from '../../components/SortOptions';
import type { City, Offer } from '../../mocks';
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
  const [sortType, setSortType] = useState<SortType>('Popular');
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

  const sortOffers = (offers: Offer[], sort: SortType): Offer[] => {
    const sorted = [...offers];
    switch (sort) {
      case 'Price: low to high':
        return sorted.sort((a, b) => Number(a.priceValue) - Number(b.priceValue));
      case 'Price: high to low':
        return sorted.sort((a, b) => Number(b.priceValue) - Number(a.priceValue));
      case 'Top rated first':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'Popular':
      default:
        return sorted;
    }
  };

  const sortedOffers = useMemo(
    () => sortOffers(filteredOffers, sortType),
    [filteredOffers, sortType]
  );

  // Сбрасываем активное предложение при смене города
  useEffect(() => {
    setActiveOfferId(null);
  }, [activeCityId]);

  const quantity = sortedOffers.length;

  const selectedOffer = activeOfferId
    ? sortedOffers.find((offer) => offer.id === activeOfferId)
    : undefined;

  const cards: CardProps[] = sortedOffers.map((offer) => ({
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
              <SortOptions currentSort={sortType} onSortChange={setSortType} />
              <OfferList cards={cards} onCardHover={setActiveOfferId} />
            </section>
            <div className="cities__right-section">
              <Map
                city={activeCity}
                offers={sortedOffers}
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
