import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { DataType } from './types';

const data: DataType = {
  quantity: 312,
  cards: [
    {
      mark: 'Premium',
      priceValue: '120',
      priceText: 'night',
      name: 'Beautiful &amp; luxurious apartment at great location',
      type: 'Apartment',
    },
    {
      mark: '',
      priceValue: '80',
      priceText: 'night',
      name: 'Wood and stone place',
      type: 'Room',
    },
    {
      mark: '',
      priceValue: '132',
      priceText: 'night',
      name: 'Canal View Prinsengracht',
      type: 'Apartment',
    },
    {
      mark: 'Premium',
      priceValue: '180',
      priceText: 'night',
      name: 'Nice, cozy, warm big bed apartment',
      type: 'Apartment',
    },
    {
      mark: '',
      priceValue: '80',
      priceText: 'night',
      name: 'Wood and stone place',
      type: 'Room',
    },
  ],
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App data={data}/>
  </React.StrictMode>
);
