import type { Meta, StoryObj } from '@storybook/react-vite';
import ReviewsList from './ReviewsList';
import type { Review } from '../../types';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const mockReviews: Review[] = [
  {
    id: '1',
    offerID: '1',
    user: {
      name: 'Max',
      avatar: 'img/avatar-max.jpg'
    },
    rating: 4,
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    date: '2019-04-24'
  },
  {
    id: '2',
    offerID: '1',
    user: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg'
    },
    rating: 5,
    comment: 'Perfect location and amazing views! The apartment was clean and had everything we needed for our stay.',
    date: '2019-05-15'
  },
  {
    id: '3',
    offerID: '1',
    user: {
      name: 'John',
      avatar: 'img/avatar-max.jpg'
    },
    rating: 3,
    comment: 'Good apartment but could use some updates. The location is great though.',
    date: '2019-06-10'
  }
];

const meta = {
  title: 'Example/ReviewsList',
  component: ReviewsList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReviewsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    reviews: mockReviews,
    formatDate,
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [mockReviews[0]],
    formatDate,
  },
};

export const Empty: Story = {
  args: {
    reviews: [],
    formatDate,
  },
};

