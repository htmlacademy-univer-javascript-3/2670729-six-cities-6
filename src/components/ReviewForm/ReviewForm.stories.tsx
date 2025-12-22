import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '../../store/reducer';
import ReviewForm from './ReviewForm';

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
        authorizationStatus: 'AUTH',
        user: null,
        favoriteCount: 0,
      },
    },
  });

const meta = {
  title: 'Example/ReviewForm',
  component: ReviewForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReviewForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    offerId: '1',
    onReviewAdded: () => {},
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
};

