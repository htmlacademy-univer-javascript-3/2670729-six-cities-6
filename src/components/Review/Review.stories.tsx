import type { Meta, StoryObj } from '@storybook/react-vite';
import Review from './Review';
import type { Review as ReviewType } from '../../types';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const mockReview: ReviewType = {
  id: '1',
  offerID: '1',
  user: {
    name: 'Max',
    avatar: 'img/avatar-max.jpg'
  },
  rating: 4,
  comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
  date: '2019-04-24'
};

const meta = {
  title: 'Example/Review',
  component: Review,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Review>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    review: mockReview,
    formattedDate: formatDate(mockReview.date),
  },
};

export const HighRating: Story = {
  args: {
    review: {
      ...mockReview,
      id: '2',
      rating: 5,
      comment: 'Perfect location and amazing views! The apartment was clean and had everything we needed for our stay.',
      user: {
        name: 'Angelina',
        avatar: 'img/avatar-angelina.jpg'
      },
      date: '2019-05-15'
    },
    formattedDate: formatDate('2019-05-15'),
  },
};

export const LowRating: Story = {
  args: {
    review: {
      ...mockReview,
      id: '3',
      rating: 2,
      comment: 'The apartment needs some updates. The location is okay but the facilities are outdated.',
      user: {
        name: 'John',
        avatar: 'img/avatar-max.jpg'
      },
      date: '2019-06-10'
    },
    formattedDate: formatDate('2019-06-10'),
  },
};

