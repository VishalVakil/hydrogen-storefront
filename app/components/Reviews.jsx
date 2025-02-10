import React, {useState} from 'react';

/**
 * Enhanced Reviews component for Shopify products
 * @param {{
 *   productId: string;
 *   reviews?: Array<{
 *     id: number;
 *     author: string;
 *     rating: number;
 *     content: string;
 *     createdAt?: string;
 *     verifiedPurchase?: boolean;
 *     helpfulVotes?: number;
 *   }>;
 * }} props
 */
export function Reviews({productId, reviews}) {
  const initialReviews = Array.isArray(reviews) ? reviews : [];
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const averageRating = initialReviews.length
    ? initialReviews.reduce((acc, review) => acc + review.rating, 0) /
      initialReviews.length
    : 0;

  const sortedReviews = [...initialReviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  const RatingStars = ({rating}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '20px',
            color: star <= rating ? '#FDB022' : '#D1D5DB',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  const commonButtonStyles = {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  };

  if (!initialReviews.length) {
    return (
      <div style={{padding: '32px 0'}}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '16px',
          }}
        >
          Customer Reviews
        </h2>
        <p
          style={{
            color: '#4B5563',
            marginBottom: '16px',
          }}
        >
          No reviews yet. Be the first to review this product!
        </p>
        <button
          onClick={() => setShowReviewForm(true)}
          style={commonButtonStyles}
        >
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <section style={{padding: '32px 0'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          gap: '24px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            Customer Reviews
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RatingStars rating={Math.round(averageRating)} />
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
          <p
            style={{
              color: '#4B5563',
              marginTop: '4px',
              fontSize: '14px',
            }}
          >
            Based on {initialReviews.length} review
            {initialReviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
            }}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <button
            onClick={() => setShowReviewForm(true)}
            style={commonButtonStyles}
          >
            Write a Review
          </button>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            style={{
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <RatingStars rating={review.rating} />
                  <span style={{fontWeight: '500'}}>{review.author}</span>
                </div>
                {review.verifiedPurchase && (
                  <span
                    style={{
                      color: '#059669',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Verified Purchase
                  </span>
                )}
              </div>
              <span
                style={{
                  color: '#6B7280',
                  fontSize: '12px',
                }}
              >
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : ''}
              </span>
            </div>
            <p
              style={{
                margin: '12px 0',
                color: '#374151',
                lineHeight: '1.5',
              }}
            >
              {review.content}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '12px',
              }}
            >
              <button
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                Helpful ({review.helpfulVotes || 0})
              </button>
              <button
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
