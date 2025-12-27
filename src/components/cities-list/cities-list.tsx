import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { City } from '../../types';

type CitiesListProps = {
  cities: City[];
  activeCityId: string;
};

const CitiesList: React.FC<CitiesListProps> = memo(({ cities, activeCityId }) => (
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
));

CitiesList.displayName = 'CitiesList';

export default CitiesList;
