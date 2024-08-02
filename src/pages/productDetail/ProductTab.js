import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";

const ProductTab = ({ product }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    review: "",
    rating: 0,
  });
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  const getStarCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      counts[review.rating]++;
    });
    return counts;
  };
  const fetchReviews = async (page) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reviews/${product.id}?page=${page}`
      );
      console.log(response.data.reviews)
      setReviews(response.data.reviews.data);
      setAverageRating(response.data.averageRating);
      if (response.data.reviews.data.length > 0) {
        setCurrentPage(response.data.reviews.current_page);
        setTotal(response.data.reviews.total);
        setPerPage(response.data.reviews.per_page);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/reviews/${product.id}`,
        newReview
      );
      setNewReview({ name: "", email: "", review: "", rating: 0 });
      fetchReviews();
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="fa fa-star"></i>);
      } else if (rating >= i - 0.9) {
        stars.push(<i key={i} className="fa fa-star-half-o"></i>);
      } else {
        stars.push(<i key={i} className="fa fa-star-o"></i>);
      }
    }
    return stars;
  };

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    fetchReviews(currentPage);
  }, [product.id]);
  return (
    <div className="col-md-12">
      <div id="product-tab">
        <ul className="tab-nav">
          <li className={activeTab === "tab1" ? "active" : ""}>
            <Link onClick={() => handleTabClick("tab1")}>Description</Link>
          </li>
          <li className={activeTab === "tab2" ? "active" : ""}>
            <Link onClick={() => handleTabClick("tab2")}>Details</Link>
          </li>
          <li className={activeTab === "tab3" ? "active" : ""}>
            <Link onClick={() => handleTabClick("tab3")}>
              Reviews ({total})
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          <div
            id="tab1"
            className={`tab-pane fade ${
              activeTab === "tab1" ? "show active" : ""
            }`}
          >
            <div className="row px-5">
              <div className="col-md-12">
                <p className="text-center">{product.description}</p>
              </div>
            </div>
          </div>

          <div
            id="tab2"
            className={`tab-pane fade ${
              activeTab === "tab2" ? "show active" : ""
            }`}
          >
            <div className="row px-5">
              <div className="col-md-12">
                <p className="text-center">{product.details}</p>
              </div>
            </div>
          </div>

          <div
            id="tab3"
            className={`tab-pane fade ${
              activeTab === "tab3" ? "show active" : ""
            }`}
          >
            <div className="row px-5">
              {/* Rating Summary */}
              <div className="col-md-3 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Average Rating</h5>
                    <div className="d-flex align-items-center mb-3">
                      <h2 className="me-2 mb-0">
                        {parseFloat(averageRating).toFixed(1)}
                      </h2>
                      <div className="text-warning">
                        {renderStars(parseFloat(averageRating).toFixed(1))}
                      </div>
                    </div>
                    <ul className="list-unstyled">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <li
                          key={stars}
                          className="d-flex align-items-center mb-2"
                        >
                          <div className="text-warning me-2">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fa fa-star${i < stars ? "" : "-o"}`}
                              ></i>
                            ))}
                          </div>
                          <div
                            className="progress flex-grow-1"
                            style={{ height: "5px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  (getStarCounts[stars] / reviews.length) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="ms-2">{getStarCounts[stars]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Customer Reviews</h5>
                    {reviews.map((review) => (
                      <div key={review.id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="card-subtitle text-muted">
                              {review.name}
                            </h6>
                            <small className="text-muted">
                              {new Date(review.created_at).toLocaleString()}
                            </small>
                          </div>
                          <div className="text-warning mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fa fa-star${
                                  i < review.rating ? "" : "-o"
                                }`}
                              ></i>
                            ))}
                          </div>
                          <p className="card-text">{review.review}</p>
                        </div>
                      </div>
                    ))}
                    <nav aria-label="Review pagination">
                      {reviews.length > 0 && total > perPage && (
                        <div className="pagination-container">
                          <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={total}
                            pageRangeDisplayed={5}
                            onChange={(pageNumber) => fetchReviews(pageNumber)}
                            itemClass="page-item"
                            linkClass="page-link"
                          />
                        </div>
                      )}
                    </nav>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Write a Review</h5>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Name"
                          name="name"
                          value={newReview.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Your Email"
                          name="email"
                          value={newReview.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Your Review"
                          name="review"
                          value={newReview.review}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your Rating:</label>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <React.Fragment key={star}>
                              <input
                                hidden
                                className="position-absolute top-0 start-0"
                                id={`star${star}`}
                                name="rating"
                                value={star}
                                type="radio"
                                onChange={handleInputChange}
                                required
                              />
                              <label htmlFor={`star${star}`} className="me-1">
                                <i
                                  className={`fa fa-star${
                                    newReview.rating >= star ? "" : "-o"
                                  } position-relative me-3 fs-5 text-warning`}
                                  style={{ zIndex: "0" }}
                                ></i>
                              </label>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;
