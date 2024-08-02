import React from 'react';
import Slider from "react-slick";
import { Spinner } from "react-bootstrap";
import ProductItem from '../products/ProductItem';

function RelatedProducts({
  loading,
  productCate,
  settingsRealtedProduct,
  handleWishlist,
  handleClickCate
}) {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title text-center">
              <h3 className="title">Related Products</h3>
            </div>
          </div>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="row mb-5">
              <div className="products-slick">
                <Slider {...settingsRealtedProduct} className="z-3">
                  {productCate.length > 0 &&
                    productCate.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        handleWishlist={handleWishlist}
                        handleClick={handleClickCate}
                      />
                    ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;