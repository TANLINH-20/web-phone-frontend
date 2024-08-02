import React from 'react';
import { Link } from 'react-router-dom';

function ProductDetailHeader({ productName }) {
  return (
    <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/product"}>Products</Link>
                </li>
                <li className="active">{productName}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProductDetailHeader;