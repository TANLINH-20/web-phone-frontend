import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/news")
      .then((response) => {
        setNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  return (
    <div className="container my-5">
      <div id="breadcrumb" className="section">
        <div className="section-title">
          <h3 className="breadcrumb-header">Tin tức</h3>
          <ul className="breadcrumb-tree">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li className="active">News</li>
          </ul>
        </div>
      </div>
      <div className="row">
        {news.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.summary}</p>
                <Link to={`/news/${item.id}`} className="btn btn-primary">
                  Đọc thêm
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
