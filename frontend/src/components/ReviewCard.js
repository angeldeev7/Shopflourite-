import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/ReviewCard.css';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'star filled' : 'star'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          {review.user?.avatar ? (
            <img src={review.user.avatar} alt={review.user.name} className="reviewer-avatar" />
          ) : (
            <div className="reviewer-avatar placeholder">
              {review.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="reviewer-name">
              {review.user?.name || 'Anonymous'}
              {review.isVerified && <span className="verified-badge">✓ Verified Purchase</span>}
            </h4>
            <div className="review-rating">{renderStars(review.rating)}</div>
          </div>
        </div>
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="review-comment">{review.comment}</p>

      {review.helpful > 0 && (
        <div className="review-helpful">
          {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
