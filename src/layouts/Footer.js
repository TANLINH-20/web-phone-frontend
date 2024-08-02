import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="section d-flex">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-xs-6">
              <div className="footer">
                <h3 className="footer-title">Giới thiệu</h3>
                <p>Nguyen Tan Linh</p>
                <ul className="footer-links">
                  <li><Link to={'/'}><i className="fa fa-nap-marker"></i>TP.Ho Chi Minh</Link></li>
                  <li><Link to={'/'}><i className="fa fa-phone"></i>0343970915</Link></li>
                  <li><Link to={'/'}><i className="fa fa-envelope-o"></i>linhnguyentan24@gmail.com</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-xs-6">
              <div className="footer">
                <h3 className="footer-title">Ngành hàng</h3>
                <ul className="footer-links p-0">
                  <li><Link to={'/'}>Điện thoại</Link></li>
                  <li><Link to={'/'}>Tablet</Link></li>
                  <li><Link to={'/'}>Laptop</Link></li>
                  <li><Link to={'/'}>Đồng hồ</Link></li>
                  <li><Link to={'/'}>Phụ kiện</Link></li>
                  <li><Link to={'/'}>Khuyến mãi</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-xs-6">
              <div className="footer">
                <h3 className="footer-title">Liên hệ</h3>
                <ul className="footer-links p-0">
                  <li><Link to={'/'}>Giới thiệu</Link></li>
                  <li><Link to={'/'}>Liên hệ</Link></li>
                  <li><Link to={'/'}>Chính sách mua hàng</Link></li>
                  <li><Link to={'/'}>Mua hàng</Link></li>
                  <li><Link to={'/'}>Điều khoản dịch vụ</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-xs-6">
              <div className="footer">
                <h3 className="footer-title">Dịch vụ</h3>
                <ul className="footer-links p-0">
                  <li><Link to={'/'}>Tài khoản</Link></li>
                  <li><Link to={'/'}>Giỏ hàng</Link></li>
                  <li><Link to={'/'}>Ưa thích</Link></li>
                  <li><Link to={'/'}>Theo dõi đơn hàng</Link></li>
                  <li><Link to={'/'}>Trợ giúp</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="bottom-footer" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="footer-payments">
                <ul>
                  <li><Link to={'/'}><i className="fa fa-cc-visa"></i></Link></li>
                  <li><Link to={'/'}><i className="fa fa-credit-card"></i></Link></li>
                  <li><Link to={'/'}><i className="fa fa-cc-paypal"></i></Link></li>
                  <li><Link to={'/'}><i className="fa fa-cc-mastercard"></i></Link></li>
                  <li><Link to={'/'}><i className="fa fa-cc-discover"></i></Link></li>
                  <li><Link to={'/'}><i className="fa fa-cc-amex"></i></Link></li>
                </ul>
                <span className="copyright">
                  Copyright &copy; {new Date().getFullYear()} All rights reserved |
                  This template is made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <Link to={'/'}>Nguyen Tan Linh</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
