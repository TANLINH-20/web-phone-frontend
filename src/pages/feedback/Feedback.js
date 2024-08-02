import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/feedback", { rating, comment })
      .then((response) => {
        toast.success("Cảm ơn bạn đã gửi phản hồi!");
        setRating(0);
        setComment("");
      })
      .catch((error) => {
        console.error("Error sending feedback:", error);
      });
  };

  return (
    <div className="container my-5">
      <div id="breadcrumb" className="section">
        <div className="section-title">
          <h3 className="breadcrumb-header">Phản hồi</h3>
          <ul className="breadcrumb-tree">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li className="active">Feedback</li>
          </ul>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Đánh giá
          </label>
          <select
            className="form-select"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Chọn đánh giá</option>
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>
            <option value="5">5 sao</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Nhận xét
          </label>
          <textarea
            className="form-control"
            id="comment"
            rows="5"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Gửi phản hồi
        </button>
      </form>
    </div>
  );
}

export default Feedback;
