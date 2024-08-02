import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { urlImage } from "../../config";

const ProductItem = ({ product, handleWishlist, handleClick }) => {
  return (
    <div key={product.id} className="product">
      <div className="product-img">
        <img
          src={`${urlImage}/${JSON.parse(product.photo)[0]}`}
          alt={product.name}
        />
        <div className="product-label">
          {new Date(product.sale_expires).getTime() > new Date().getTime() && (
            <span className="sale">-{product.sale * 100}%</span>
          )}
          {new Date(product.created_at).toDateString() ===
            new Date().toDateString() && <span className="new">NEW</span>}
        </div>
      </div>
      <div className="product-body">
        <p className="product-category">{product.category.name}</p>
        <h3 className="product-name">
          <Link to="/">{product.name}</Link>
        </h3>
        {new Date(product.sale_expires).getTime() > new Date().getTime() ? (
          <h4 className="product-price">
            ${product.price - product.price * product.sale}{" "}
            <del className="product-old-price">${product.price}</del>
          </h4>
        ) : (
          <h4 className="product-price">${product.price}</h4>
        )}
        <div className="product-btns">
          <Button
            id={product.id}
            className="add-to-wishlist"
            onClick={handleWishlist}
            bsPrefix="q"
          >
            <i id={product.id} className="fa fa-heart-o"></i>
            <span className="tooltipp">add to wishlist</span>
          </Button>
          <button className="add-to-compare">
            <i className="fa fa-exchange"></i>
            <span className="tooltipp">add to compare</span>
          </button>
          <Button
            id={product.id}
            className="qucik-view"
            onClick={(e) => handleClick(e)}
            bsPrefix="q"
          >
            <i id={product.id} className="fa fa-eye"></i>
            <span className="tooltipp qucik-view">quick view</span>
          </Button>
        </div>
      </div>
      <div className="add-to-cart">
        <button
          id={product.id}
          className="add-to-cart-btn"
          onClick={handleClick}
        >
          <i
            id={product.id}
            onClick={handleClick}
            className="fa fa-shopping-cart"
          ></i>{" "}
          add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
