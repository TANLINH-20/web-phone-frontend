import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Spinner from "react-bootstrap/Spinner";
import { connect } from "react-redux";

const ProductPage = ({
  title,
  showQuickView,
  showLogin,
  updateWishlistCount,
}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, currentCategory);
  }, [currentPage, currentCategory]);

  const fetchProducts = async (page, category) => {
    setLoading(true);
    try {
      let response;
      if (category !== null) {
        response = await axios.get(
          `http://127.0.0.1:8000/api/product/categories/${category}?page=${page}`
        );
      } else {
        response = await axios.get(
          `http://127.0.0.1:8000/api/products?page=${page}`
        );
      }
      setProducts(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Error fetching products", error);
    }
    setLoading(false);
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

  const handleWishlist = async (e) => {
    if (!localStorage.getItem("token")) {
      showLogin();
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/products/wishlist",
          {
            product_id: e.target.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          updateWishlistCount(response.data);
          toast.success("Added to wishlist!");
        }
      } catch (error) {
        toast.error("Product is already in the wishlist!");
      }
    }
  };

  const handleClick = (e, categoryId) => {
    const { id, className } = e.target;

    if (
      className.includes("add-to-cart-btn") ||
      className.includes("qucik-view") ||
      className.includes("fa-eye")
    ) {
      showQuickView(id);
    } else {
      e.preventDefault();
      setCurrentCategory(categoryId);
      setCurrentPage(1); // Reset to first page when category changes
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const chunkArray = (array, size) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const productRows =
    Array.isArray(products) && products.length > 0
      ? chunkArray(products, 4)
      : [];

  return (
    <div>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="col-md-12">
            <div className="section-title">
              <h3 className="breadcrumb-header">{title}</h3>
              <ul className="breadcrumb-tree">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li className="active">Products</li>
              </ul>
              <div className="section-nav">
                <ul className="section-tab-nav tab-nav">
                  <li
                    key={0}
                    className={currentCategory === null ? "active" : ""}
                  >
                    <Link onClick={(e) => handleClick(e, null)} to={"/"}>
                      All
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={
                        category.id === currentCategory ? "active" : ""
                      }
                    >
                      <Link
                        id={category.id}
                        onClick={(e) => handleClick(e, category.id)}
                        to={"/"}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" />
            </div>
          ) : productRows.length > 0 ? (
            productRows.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((product) => (
                  <div className="col-md-3 col-xs-3" key={product.id}>
                    <ProductItem
                      product={product}
                      handleWishlist={handleWishlist}
                      handleClick={handleClick}
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center fs-5 ">No products found.</div>
          )}
          {productRows.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lsaquo;
              </button>
              {Array.from({ length: lastPage }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                &rsaquo;
              </button>
              <button
                onClick={() => handlePageChange(lastPage)}
                disabled={currentPage === lastPage}
              >
                &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  productId: state.product_id,
  showModal: state.show_modal,
});

const mapDispatchToProps = (dispatch) => ({
  showQuickView: (id) => dispatch({ type: "QUICKVIEW_CONTROL", value: id }),
  showLogin: () => dispatch({ type: "LOGIN_CONTROL", value: true }),
  updateWishlistCount: (count) =>
    dispatch({ type: "WISHLIST_COUNT", value: count }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
