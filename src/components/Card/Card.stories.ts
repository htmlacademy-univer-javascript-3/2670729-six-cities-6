import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from './Card';

const meta = {
  title: 'Example/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    mark: '',
    priceValue: '80',
    priceText: 'night',
    name: 'Wood and stone place',
    type: 'Room',
  },
};
export const Premium: Story = {
  args: {
    mark: 'Premium',
    priceValue: '120',
    priceText: 'night',
    name: 'Beautiful &amp; luxurious apartment at great location',
    type: 'Apartment',
  },
};
