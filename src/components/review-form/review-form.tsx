import { useState, ChangeEvent, FormEvent, useCallback, useMemo } from 'react';
import { useAppDispatch } from '../../store';
import { postReview } from '../../store/actions';

type ReviewFormProps = {
  offerId: string;
  onReviewAdded: () => void;
};

const ReviewForm = ({ offerId, onReviewAdded }: ReviewFormProps) => {
  type ReviewFormData = {
    rating: string;
    review: string;
  };

  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: '',
    review: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = useMemo((): boolean => {
    const rating = Number(formData.rating);
    const reviewLength = formData.review.trim().length;
    return rating >= 1 && rating <= 5 && reviewLength >= 50 && reviewLength <= 300;
  }, [formData.rating, formData.review]);

  const handleFieldChange = useCallback((evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const rating = Number(formData.rating);
      const comment = formData.review.trim();

      await dispatch(postReview(offerId, rating, comment));

      // Очищаем форму после успешной отправки
      setFormData({
        rating: '',
        review: '',
      });

      // Обновляем список комментариев через callback
      onReviewAdded();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 400) {
          setError(axiosError.response.data?.error || 'Invalid data. Please check your review.');
        } else {
          setError('Failed to submit review. Please try again.');
        }
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [offerId, formData, isFormValid, isSubmitting, dispatch, onReviewAdded]);

  const btDisabled = !isFormValid || isSubmitting;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={(evt) => void handleSubmit(evt)}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      {error && (
        <div className="reviews__error" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          checked={formData.rating === '5'}
          onChange={handleFieldChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="5-stars"
          className="reviews__rating-label form__rating-label"
          title="perfect"
        >
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={formData.rating === '4'}
          onChange={handleFieldChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="4-stars"
          className="reviews__rating-label form__rating-label"
          title="good"
        >
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={formData.rating === '3'}
          onChange={handleFieldChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="3-stars"
          className="reviews__rating-label form__rating-label"
          title="not bad"
        >
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={formData.rating === '2'}
          onChange={handleFieldChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="2-stars"
          className="reviews__rating-label form__rating-label"
          title="badly"
        >
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-star"
          type="radio"
          checked={formData.rating === '1'}
          onChange={handleFieldChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="1-star"
          className="reviews__rating-label form__rating-label"
          title="terribly"
        >
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleFieldChange}
        disabled={isSubmitting}
        minLength={50}
        maxLength={300}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={btDisabled}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
