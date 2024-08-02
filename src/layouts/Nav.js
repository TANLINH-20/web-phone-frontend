import React from "react";
import { Link, useLocation } from "react-router-dom";
const Nav = () =>{
  const { pathname } = useLocation();
  return(
  <nav id="navigation">
    <div className="container">
      <div id="responsive-nav">
        <ul className="main-nav nav nav-navbar">
          <li className={pathname == '/' && "active"}>
            <Link to="/">Trang chủ</Link>
          </li>
          <li className={pathname == '/product' && "active"}>
            <Link to="/product">Sản phẩm</Link>
          </li>
          <li className={pathname == '/tin-tuc' && "active"}>
            <Link to="/tin-tuc">Tin tức</Link>
          </li>
          <li className={pathname == '/lien-he' && "active"}>
            <Link to="/lien-he">Liên hệ</Link>
          </li>
          <li className={pathname == '/phan-hoi' && "active"}>
            <Link to="/phan-hoi">Phản hồi</Link>
          </li>
          <li className={pathname == '/thong-tin' && "active"}>
            <Link to="/thong-tin">Thông tin</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);}
export default Nav;
