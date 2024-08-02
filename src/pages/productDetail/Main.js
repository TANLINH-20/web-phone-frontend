import React from "react";
import Slider from "react-slick";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { urlImage } from "../../config";

function Main({
  product,
  stocks,
  selectedSize,
  selectedColor,
  avaibleQuantity,
  quantity,
  cartButtonInit,
  cartLoading,
  settings,
  handleChange,
  handleClick,
  handleMouseLeave,
  handleWishlist,
}) {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-md-push-2">
            <div id="product-main-img">
              <div className="product-preview">
                <Slider {...settings}>
                  {JSON.parse(product.photo).map((photo, index) => (
                    <div key={index} className="product-preview">
                      <img
                        height="300"
                        width="300"
                        src={`${urlImage}/${JSON.parse(product.photo)[0]}`}
                        alt={product.name}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <div>
                
              </div>
              <div>
                {new Date(product.sale_expires).getTime() >
                new Date().getTime() ? (
                  <h3 className="product-price">
                    {product.price - product.price * product.sale}{" "}
                    <del className="product-old-price">{product.price}</del>
                  </h3>
                ) : (
                  <h3 className="product-price">${product.price}</h3>
                )}
                {avaibleQuantity > 0 ? (
                  <span className="product-available text-info">In Stock</span>
                ) : (
                  <span className="product-available text-danger">
                    Out of Stock
                  </span>
                )}
              </div>
              <p>{product.details}</p>
            </div>
            <div className="product-other">
              <div className="product-options">
                <label>
                  Size
                  <select
                    className="m-2 input-select"
                    onChange={handleChange}
                    value={selectedSize}
                  >
                    {stocks.length > 0 &&
                      [...new Set(stocks.map((stock) => stock.size))].map(
                        (stockSize, index) => (
                          <option key={index} value={stockSize}>
                            {stockSize}
                          </option>
                        )
                      )}
                  </select>
                </label>
                <label>
                  Color
                  <select
                    className="m-2 input-select"
                    onChange={handleChange}
                    value={selectedColor}
                  >
                    {stocks.length > 0 &&
                      stocks
                        .filter((stock) => stock.size === selectedSize)
                        .map((stock) => (
                          <option key={stock.id} value={stock.color}>
                            {stock.color}
                          </option>
                        ))}
                  </select>
                </label>
              </div>

              <div className="add-to-cart ">
                <div className="qty-label">
                  Qty:{" "}
                  <sub style={{ bottom: "unset" }}>
                    {avaibleQuantity ? "Only " : "There are "} {avaibleQuantity}{" "}
                    item(s) available!
                  </sub>
                  <div className="input-number">
                    <input
                      type="number"
                      disabled={!avaibleQuantity}
                      value={avaibleQuantity > 0 ? quantity : 0}
                      onChange={handleChange}
                    />
                    <span className="qty-up" onClick={handleChange}>
                      +
                    </span>
                    <span className="qty-down" onClick={handleChange}>
                      -
                    </span>
                  </div>
                </div>
                {avaibleQuantity > 0 && (
                  <button
                    className="add-to-cart-btn"
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    disabled={!avaibleQuantity}
                  >
                    {cartButtonInit ? (
                      <React.Fragment>
                        <i className="fa fa-shopping-cart"></i>
                        <span>add to cart</span>
                      </React.Fragment>
                    ) : cartLoading ? (
                      <React.Fragment>
                        <i>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </i>
                        <span>Adding...</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <i className="fa fa-check"></i>
                        <span>Added</span>
                      </React.Fragment>
                    )}
                  </button>
                )}
              </div>

              <ul className="product-btns ps-3 d-flex mt-4 text-align-center">
                <li>
                  <Link
                    id={product.id}
                    className="me-5"
                    onClick={handleWishlist}
                    to={"/"}
                  >
                    <i
                      id={product.id}
                      className="fa fa-heart-o fs-3"
                    ></i>{" "}
                  </Link>
                </li>
                <li>
                  <Link to={"/"} className="ms-5">
                    <i className="fa fa-exchange fs-3"></i>
                  </Link>
                </li>
              </ul>

              <ul className="product-links d-flex p-0">
                <li>Category:</li>
                <li>
                  <Link className="ms-2" to={"/"}>
                    {product.category.name}
                  </Link>
                </li>
              </ul>

              <ul className="product-links p-0 d-flex align-items-center">
                <li>Share:</li>
                <li className="fs-4 mx-2">
                  <Link to={"/"}>
                    <i className="fa fa-facebook"></i>
                  </Link>
                </li>
                <li className="fs-4 mx-2">
                  <Link to={"/"}>
                    <i className="fa fa-twitter"></i>
                  </Link>
                </li>
                <li className="fs-4 mx-2">
                  <Link to={"/"}>
                    <i className="fa fa-google-plus"></i>
                  </Link>
                </li>
                <li className="fs-4 mx-2">
                  <Link to={"/"}>
                    <i className="fa fa-envelope"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
