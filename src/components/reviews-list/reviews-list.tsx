import { memo } from 'react';
import type { Review } from '../../types';
import ReviewComponent from '../review';

export type ReviewsListProps = {
  reviews: Review[];
  formatDate: (dateString: string) => string;
};

const ReviewsList: React.FC<ReviewsListProps> = memo(({ reviews, formatDate }) => {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <ul className="reviews__list">
      {reviews.map((review) => (
        <ReviewComponent
          key={review.id}
          review={review}
          formattedDate={formatDate(review.date)}
        />
      ))}
    </ul>
  );
});

ReviewsList.displayName = 'ReviewsList';

export default ReviewsList;

