import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { DataType } from './types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { offers, reviews, cities, user } from './mocks';
import { store } from './store';
import { loadOffers } from './store/actions';

// Преобразуем данные из offers в формат cards для совместимости
const cards = offers.map((offer) => ({
  id: offer.id,
  mark: offer.mark,
  priceValue: offer.priceValue,
  priceText: offer.priceText,
  name: offer.name,
  type: offer.type,
  rating: offer.rating,
  image: offer.images[0],
  isFavorite: offer.isFavorite
}));

const data: DataType = {
  quantity: offers.length,
  cards: cards,
  offers: offers,
  reviews: reviews,
  cities: cities,
  user: user
};

// Загружаем тестовые данные в Redux store
store.dispatch(loadOffers(offers));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App data={data} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
