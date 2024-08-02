import React, { Component } from "react";
import { Link } from "react-router-dom";
import Authentification from "../pages/auth/Authentification";
import { connect } from "react-redux";
import CartPreview from "../pages/cart/CartPreview";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Search from "../pages/search/Search";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartItemCount: 0,
      wishlistCount: 0,
    };
  }
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getShoppingCartCount();
      this.getWishlistCount();
    } else if (localStorage.getItem("cartList"))
      this.props.updateCartCount(
        JSON.parse(localStorage.getItem("cartList")).length
      );
  }

  componentDidUpdate() {
    if (this.props.cartCount !== this.state.cartItemCount)
      if (localStorage.getItem("token")) this.getShoppingCartCount();
      else if (localStorage.getItem("cartList"))
        this.props.updateCartCount(
          JSON.parse(localStorage.getItem("cartList")).length
        );

    if (this.props.wishlistCount !== this.state.wishlistCount)
      if (localStorage.getItem("token")) {
        this.getWishlistCount();
      }
  }

  getShoppingCartCount() {
		
		axios.get('http://127.0.0.1:8000/api/product/cart-list/count', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        }).then(result => {
			
			let localCartList = JSON.parse(localStorage.getItem('cartList'))
			let stockList = localCartList.map(list => list[0].stock_id)

			let cartList = [...stockList, ...result.data]
			let uniqueCartList = [...new Set(cartList)]; 

			this.setState({cartItemCount: uniqueCartList.length})
			this.props.updateCartCount(uniqueCartList.length)
      	})
	}
  

  getWishlistCount() {
    axios
      .get("http://127.0.0.1:8000/api/product/wishlist/count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        this.setState({ wishlistCount: result.data });
        this.props.updateWishlistCount(result.data);
      });
  }
  render() {
    return (
      <header>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        {/* TOP HEADER */}
        <div id="top-header">
          <div className="container">
            <ul className="header-links">
              <li>
                <Link to={"/"}>
                  <i className="fa fa-phone"></i> 0343970915
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <i className="fa fa-envelope-o"></i> linhnguyentan24@gmail.com
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <i className="fa fa-map-marker"></i> TP.Ho Chi Minh
                </Link>
              </li>
            </ul>
            <ul className="header-links">
              <li>
                <Link to={"/"}>
                  <i className="fa fa-euro"></i> USD
                </Link>
              </li>
              <Authentification />
            </ul>
          </div>
        </div>
        {/* /TOP HEADER */}
        {/* MAIN HEADER */}
        <div id="header">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header-logo">
                  <Link to="/" className="logo">
                    <img src={require("../assets/img/logo.png")} alt="Logo" className="p-0" />
                  </Link>
                </div>
              </div>
              <div className="col-md-6">
                {/* SEARCH BAR */}
                <Search/>
                {/* /SEARCH BAR */}
              </div>
              <div className="col-md-3">
                {/* ACCOUNT */}
                <div className="header-ctn">
                  <div>
                    {/* Wishlist */}
                    <Link to="/wishlist">
                      <i className="fa fa-heart-o"></i>
                      <span>Yêu thích</span>
                      <div className="qty">
                        {this.props.wishlistCount > 0
                          ? this.props.wishlistCount
                          : 0}
                      </div>
                    </Link>
                  </div>
                  {/* Cart */}
                  <div className="dropdown">
                    <Link className="dropdown-toggle" to={"/shopping-cart"}>
                      <i className="fa fa-shopping-cart"></i>
                      <span>Giỏ hàng</span>
                      <div className="qty">
                        {this.props.cartCount > 0 ? this.props.cartCount : 0}
                      </div>
                    </Link>
                    <CartPreview />
                  </div>
                  {/* Menu Toggle */}
                  <div className="menu-toggle">
                    <Link to={"/"}>
                      <i className="fa fa-bars"></i>
                    </Link>
                    <span>Menu</span>
                  </div>
                  {/* /ACCOUNT */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /MAIN HEADER */}
      </header>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cartCount: state.cart_count,
    wishlistCount: state.wishlist_count,
    userData: state.user_data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
    updateWishlistCount: (count) =>
      dispatch({ type: "WISHLIST_COUNT", value: count }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
