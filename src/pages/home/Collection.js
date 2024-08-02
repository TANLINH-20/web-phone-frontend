import React from 'react';
import { Link } from 'react-router-dom';

const Collection = () => (
  <div className="section">
    <div className="container">
      <div className="row z-n1">
        <div className="col-md-4 col-xs-6">
          <div className="shop">
            <div className="shop-img">
              <img src={require("../../assets/img/shop01.png")} alt="" />
            </div>
            <div className="shop-body">
              <h3>Laptops</h3>
              <Link to={'/product'} className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="shop">
            <div className="shop-img">
              <img src={require("../../assets/img/shop02.png")} alt="" />
            </div>
            <div className="shop-body">
              <h3>Cameras</h3>
              <Link to={'/product'} className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="shop">
            <div className="shop-img">
              <img src={require("../../assets/img/shop03.png")} alt="" />
            </div>
            <div className="shop-body">
              <h3>Điện thoại</h3>
              <Link to={'/product'} className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Collection;
