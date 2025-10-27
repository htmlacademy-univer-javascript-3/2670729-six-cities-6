import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';

const meta = {
  title: 'Example/Card',
  component: Card,
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
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    id: 1,
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
    id: 2,
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
