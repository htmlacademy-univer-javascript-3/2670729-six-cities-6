import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { AuthInfo } from '../../types';
import { reducer } from '../../store/reducer';
import Header from './header';

const mockUser: AuthInfo = {
  token: 'mock-token',
  email: 'Oliver.conner@gmail.com',
  name: 'Oliver Conner',
  avatarUrl: 'https://avatars.mds.yandex.net/i?id=5497d7f580f843ce76e57a0302e823c3_l-7043025-images-thumbs&n=13',
  isPro: false,
};

const createMockStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN', user: AuthInfo | null = null) =>
  configureStore({
    reducer: reducer,
    preloadedState: {
      offers: {
        city: 'Paris',
        offers: [],
        isLoading: false,
      },
      auth: {
        authorizationStatus,
        user,
        favoriteCount: 0,
      },
    },
  });

const meta = {
  title: 'Example/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    isPageLogin: false,
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore('AUTH', mockUser)}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};

export const LoggedOut: Story = {
  args: {
    isPageLogin: false,
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore('NO_AUTH', null)}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};

export const ForLoginPage: Story = {
  args: {
    isPageLogin: true,
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore('NO_AUTH', null)}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};

