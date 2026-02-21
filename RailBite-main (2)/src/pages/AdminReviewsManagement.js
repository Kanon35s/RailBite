import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { reviewAPI } from '../services/api';

const AdminReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('railbite_token');
      const res = await reviewAPI.getAll(token);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const userName = review.userName || review.user?.name || '';
      const orderNum = review.orderNumber || '';
      const commentText = review.comment || '';

      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderNum.includes(searchQuery) ||
        commentText.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating = filterRating === 'all' ||
        Math.floor(review.ratings?.overall) === parseInt(filterRating);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, filterRating]);

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('railbite_token');
      const res = await reviewAPI.delete(id, token);
      if (res.data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const getStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return '\u2B50'.repeat(fullStars) + '\u2606'.repeat(5 - fullStars);
  };

  const avgOverall = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.ratings?.overall || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-header">
            <h1>Customer Reviews</h1>
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
            <button className="admin-btn-link" onClick={loadReviews} style={{ marginLeft: '1rem' }}>Retry</button>
          </div>
        )}

        <div className="admin-stats-grid admin-stats-grid-small">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📝</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Total Reviews</p>
              <h3 className="admin-stat-value">{reviews.length}</h3>
              <span className="admin-stat-sub">All customer reviews</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">⭐</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">Average Rating</p>
              <h3 className="admin-stat-value">{avgOverall}</h3>
              <span className="admin-stat-sub">Overall satisfaction</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🌟</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">5 Star Reviews</p>
              <h3 className="admin-stat-value">{reviews.filter(r => Math.floor(r.ratings?.overall) === 5).length}</h3>
              <span className="admin-stat-sub">Excellent ratings</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">✨</div>
            <div className="admin-stat-content">
              <p className="admin-stat-label">4+ Star Reviews</p>
              <h3 className="admin-stat-value">{reviews.filter(r => (r.ratings?.overall || 0) >= 4).length}</h3>
              <span className="admin-stat-sub">Positive feedback</span>
            </div>
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
                  <th>Order #</th>
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
                    <tr key={review._id}>
                      <td>#{review.orderNumber || 'N/A'}</td>
                      <td><strong>{review.userName || review.user?.name || 'Customer'}</strong></td>
                      <td>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.food)}
                        </span>
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.delivery)}
                        </span>
                      </td>
                      <td>
                        <span className="rating-display">
                          {getStars(review.ratings?.overall)}
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
                          onClick={() => deleteReview(review._id)}
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
