import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const saved = localStorage.getItem('railbiteReviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = 
        review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.orderId?.toString().includes(searchQuery) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = filterRating === 'all' || 
        Math.floor(review.ratings?.overall) === parseInt(filterRating);
      
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, filterRating]);

  const deleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter(review => review.id !== id);
      localStorage.setItem('railbiteReviews', JSON.stringify(updated));
      setReviews(updated);
    }
  };

  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    return '⭐'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Customer Reviews</h1>
            <p>View and manage all customer reviews</p>
          </div>
        </div>

        <div className="admin-stats-row">
          <div className="admin-stat-mini">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{reviews.length}</span>
          </div>
          <div className="admin-stat-mini">
            <span className="stat-label">5 Star</span>
            <span className="stat-value">
              {reviews.filter(r => r.ratings?.overall === 5).length}
            </span>
          </div>
          <div className="admin-stat-mini">
            <span className="stat-label">4 Star</span>
            <span className="stat-value">
              {reviews.filter(r => r.ratings?.overall === 4).length}
            </span>
          </div>
          <div className="admin-stat-mini">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + (r.ratings?.overall || 0), 0) /
                    reviews.length
                  ).toFixed(1)
                : '0.0'}
            </span>
          </div>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Food</th>
                  <th>Delivery</th>
                  <th>Overall</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td>#{review.orderId}</td>
                      <td><strong>{review.userName}</strong></td>
                      <td>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.food || 0)}
                        </span>
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.delivery || 0)}
                        </span>
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.overall || 0)}
                        </span>
                      </td>
                      <td>
                        <div className="review-comment-cell">
                          {review.comment || 'No comment'}
                        </div>
                      </td>
                      <td>
                        <button
                          className="admin-btn-delete"
                          onClick={() => deleteReview(review.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsManagement;
