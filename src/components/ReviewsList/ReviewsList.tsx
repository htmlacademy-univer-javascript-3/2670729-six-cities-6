import type { Review } from '../../types';
import ReviewComponent from '../Review';

export type ReviewsListProps = {
  reviews: Review[];
  formatDate: (dateString: string) => string;
};

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, formatDate }) => {
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
};

export default ReviewsList;

