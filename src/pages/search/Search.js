import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { urlImage } from "../../config";

function Search() {
  const [category, setCategory] = useState("all");
  const [showResults, setShowResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const searchResultRef = useRef(null);
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search`, {
        params: {
          category: category,
          term: searchTerm,
        },
      });
      setSearchResults(response.data);
      setShowResults(true);
      console.log(response.data);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        setShowResults(false); // Ẩn danh sách kết quả khi click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="header-search position-relative">
      <form onSubmit={handleSearch}>
        <select
          className="input-select"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Tìm kiếm tại đây"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {showResults && (
          <div
          ref={searchResultRef}
            className="position-absolute top-100 end-0 start-0 overflow-y-auto shadow mt-1 bg-white"
            style={{ maxHeight: "300px", zIndex: "10" }}
          >
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="d-flex justify-content-center align-items-center text-dark text-decoration-none border-dark-subtle border border-bottom-0"
                >
                  <div className="col-md-4 p-3">
                    <img className="img-fluid"
                      src={`${urlImage}/${JSON.parse(product.photo)[0]}`}
                      alt={product.name}
                    />
                  </div>
                  <div className="col-md-8 p-0">
                    <h4>{product.name}</h4>
                    <div>
                    {new Date(product.sale_expires).getTime() >
                    new Date().getTime() ? (
                      <h1 className="product-price">
                        {product.price - product.price * product.sale}{" "}
                        <del className="product-old-price">{product.price}</del>
                      </h1>
                    ) : (
                      <h1 className="product-price">${product.price}</h1>
                    )}
                  </div>
                  </div>
                </Link>
              ))
            ):(
                <div className="d-flex py-5 justify-content-center align-items-center text-dark text-decoration-none border-dark-subtle border border-bottom-0">
                  <h4>Không tìm thấy sản phẩm</h4>
                </div>
            )}
          </div>
      )}
      
    </div>
  );
}

export default Search;
