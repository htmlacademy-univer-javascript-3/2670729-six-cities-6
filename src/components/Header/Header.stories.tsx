import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '../../types';
import Header from './Header';

const user: User = {
  userID: 1,
  firstName: 'Oliver',
  lastName: 'Conner',
  email: 'Oliver.conner@gmail.com',
  favoriteCount: 3,
  favorites: [2, 4, 5],
};

const meta = {
  title: 'Example/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user,
    isPageLogin: false,
  },
};

export const LoggedOut: Story = {
  args: {
    isPageLogin: false,
  },
};

export const ForLoginPage: Story = {
  args: {
    isPageLogin: true,
  },
};

