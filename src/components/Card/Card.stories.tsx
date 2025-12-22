import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '../../store/reducer';
import Card from './Card';

const createMockStore = () =>
  configureStore({
    reducer: reducer,
    preloadedState: {
      offers: {
        city: 'Paris',
        offers: [],
        isLoading: false,
      },
      auth: {
        authorizationStatus: 'NO_AUTH',
        user: null,
        favoriteCount: 0,
      },
    },
  });

const meta = {
  title: 'Example/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    id: '1',
    mark: '',
    priceValue: '80',
    priceText: 'night',
    name: 'Wood and stone place',
    type: 'Room',
    rating: 4.8,
    image: 'img/apartment-01.jpg',
    isFavorite: true,
  },
};
export const Premium: Story = {
  args: {
    id: '2',
    mark: 'Premium',
    priceValue: '120',
    priceText: 'night',
    name: 'Beautiful &amp; luxurious apartment at great location',
    type: 'Apartment',
    rating: 4.8,
    image: 'img/apartment-01.jpg',
    isFavorite: false
  },
};

export const NearPlace: Story = {
  args: {
    id: '3',
    mark: '',
    priceValue: '132',
    priceText: 'night',
    name: 'Canal View Prinsengracht',
    type: 'Apartment',
    rating: 4.2,
    image: 'img/apartment-02.jpg',
    isFavorite: false,
    cardClassName: 'near-places__card place-card',
    imageWrapperClassName: 'near-places__image-wrapper place-card__image-wrapper'
  },
};

export const PremiumNearPlace: Story = {
  args: {
    id: '4',
    mark: 'Premium',
    priceValue: '180',
    priceText: 'night',
    name: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    rating: 5.0,
    image: 'img/apartment-03.jpg',
    isFavorite: false,
    cardClassName: 'near-places__card place-card',
    imageWrapperClassName: 'near-places__image-wrapper place-card__image-wrapper'
  },
};
