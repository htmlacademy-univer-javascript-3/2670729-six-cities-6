import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Header from './Header';

const meta = {
  title: 'Example/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // args: {
  //   onLogin: fn(),
  //   onLogout: fn(),
  //   onCreateAccount: fn(),
  // },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      favoriteCount: 3,
      email: 'Oliver.conner@gmail.com',
    },
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
