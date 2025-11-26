import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { user } from '../../mocks';
import Header from './Header';

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

