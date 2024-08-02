import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Slider from "react-slick";
import Spinner from "react-bootstrap/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { urlImage } from "../../config";

function QuickView(props) {
  const [userId, setUserId] = useState("");
  const [loading, setloading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartButtonInit, setCartButtonInit] = useState(true);
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState("");
  const [stocks, setStocks] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cartCount, setCartCount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [avaibleQuantity, setAvaibleQuantity] = useState("0");
  const [settings] = useState({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  const handleClose = () => {
    setQuantity(1);
    props.updateCartCount(cartCount);
    props.hideQuickView();
  };

  function getProduct(id) {
    setloading(true);
    setProduct("");
    setStocks([]);
    setSelectedSize("");
    setSelectedColor("");
    setAvaibleQuantity("0");

    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((response) => {
        setProductId(id);
        setProduct(response.data);
        setStocks([...response.data.stocks]);
        if (response.data.stocks.length > 0) {
          setSelectedSize(response.data.stocks[0].size);
          setSelectedColor(response.data.stocks[0].color);
          setAvaibleQuantity(response.data.stocks[0].quantity);
        }
        setloading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setloading(false);
      });
  }

  function handleClick() {
    setCartLoading(true);
    setCartButtonInit(false);
    let stock = stocks.find(
      (item) => item.size === selectedSize && item.color === selectedColor
    );
    console.log(stock);

    if (!stock) {
      console.error("No matching stock found");
      setCartLoading(false);
      setCartButtonInit(true);
      toast.error(
        "No matching stock found. Please select a different size or color."
      );
      return;
    }

    if (localStorage.getItem("token")) {
      axios
        .post(
          "http://127.0.0.1:8000/api/products/cart-list",
          {
            stockId: stock.id,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setCartCount(response.data);
          setCartLoading(false);
          toast.success("Added to cart");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          setCartLoading(false);
          setCartButtonInit(true);
          toast.error("Error adding to cart. Please try again.");
        });
    } else {
      let cartItem = [
        {
          stock_id: stock.id,
          quantity: quantity,
        },
      ];

      let items = [];

      if (localStorage.getItem("cartList")) {
        items = JSON.parse(localStorage.getItem("cartList"));

        let existingItemIndex = items.findIndex(
          (item) => item[0].stock_id === stock.id
        );
        if (existingItemIndex !== -1) {
          let newQuantity = items[existingItemIndex][0].quantity + quantity;
          items[existingItemIndex][0].quantity = Math.min(
            newQuantity,
            avaibleQuantity
          );
        } else {
          items.unshift(cartItem);
        }
      } else {
        items.push(cartItem);
      }

      setCartCount(items.length);
      localStorage.setItem("cartList", JSON.stringify(items));
      setCartLoading(false);
    }
    props.updateCartCount(cartCount);
  }
  function handleChange(e) {
    const value = e.target.value;

    if (e.target.className === "input-select") {
      var found = false;
      stocks.map((stock) => {
        if (stock.size == value && !found) {
          setSelectedSize(value);
          setAvaibleQuantity(stock.quantity);
          setSelectedColor(stock.color);
          found = true;
        }
        if (stock.color == value) {
          setSelectedColor(value);
          setAvaibleQuantity(stock.quantity);
          setSelectedSize(stock.size);
        }
        if (stock.quantity > 0) {
          setQuantity(1);
        } else {
          setQuantity(0);
        }
      });
    }

    if (e.target.className === "qty-up") {
      if (quantity < avaibleQuantity) setQuantity(parseInt(quantity) + 1);
    } else if (e.target.className === "qty-down") {
      if (quantity > 1) setQuantity(parseInt(quantity) - 1);
    }

    if (e.target.type == "number") {
      if (avaibleQuantity >= value) setQuantity(value);
      else if (value < 1) setQuantity(1);
    }
  }
  function handleMouseLeave() {
    setCartButtonInit(true);
  }

  function handleWishlist(e) {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      props.showLogin();
    } else {
      axios
        .post(
          "http://127.0.0.1:8000/api/products/wishlist",
          {
            product_id: e.target.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            props.updateWishlistCount(response.data);
            toast.success("Added to wishlist!");
          }
        })
        .catch((error) => {
          toast.error("Product is already in the wishlist!");
        });
    }
  }
  useEffect(() => {
    if (props.productId > 0) {
      getProduct(props.productId);
    }
  }, [props.productId]);

  return (
    <React.Fragment>
      <Modal size="lg" show={props.showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{product && product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" />
            </div>
          ) : (
            product && (
              <React.Fragment>
                <div>
                  <div id="product-img-container" className="col-md-6">
                    {/* <!-- Product thumb imgs --> */}
                    <div id="product-imgs">
                      <Slider {...settings}>
                        {JSON.parse(product.photo).map((photo, index) => (
                          <div key={index} className="product-preview">
                            <img
                              height="300"
                              width="300"
                              src={`${urlImage}/${
                                JSON.parse(product.photo)[0]
                              }`}
                              alt={product.name}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                    {/* <!-- /Product thumb imgs -->*/}
                  </div>
                  <div id="product-detail-container" className="col-md-6">
                    {/*<!-- Product details -->*/}

                    <div className="product-details">
                      <h2 className="product-name">{product.name}</h2>
                      <div>
                        {new Date(product.sale_expires).getTime() >
                        new Date().getTime() ? (
                          <h3 className="product-price">
                            ${product.price - product.price * product.sale}{" "}
                            <del className="product-old-price">
                              ${product.price}
                            </del>
                          </h3>
                        ) : (
                          <h3 className="product-price">${product.price}</h3>
                        )}
                        <span className="product-available">
                          {avaibleQuantity > 0 ? "In" : "Out of"} Stock
                        </span>
                      </div>
                      <p>{product.description}</p>

                      <div className="product-options">
                        <label>
                          Size
                          <select
                            className="input-select"
                            onChange={handleChange}
                            value={selectedSize}
                          >
                            {stocks.length > 0 &&
                              [
                                ...new Set(stocks.map((stock) => stock.size)),
                              ].map((stockSize, index) => (
                                <option key={index} value={stockSize}>
                                  {stockSize}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label>
                          Color
                          <select
                            className="input-select"
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

                      <div className="add-to-cart">
                        <div className="qty-label">
                          Qty
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
                        <br />
                        <sub>
                          {avaibleQuantity ? "Only " : "There are "}{" "}
                          {avaibleQuantity} item(s) available!
                        </sub>
                      </div>

                      <ul className="product-btns">
                        <li>
                          <Link
                            id={product.id}
                            onClick={handleWishlist}
                            to={"/"}
                          >
                            <i
                              id={product.id}
                              onClick={handleWishlist}
                              className="fa fa-heart-o"
                            ></i>{" "}
                            add to wishlist
                          </Link>
                        </li>
                        <li>
                          <Link to={"/"}>
                            <i className="fa fa-exchange"></i> add to compare
                          </Link>
                        </li>
                      </ul>

                      <ul className="product-links">
                        <li>Category:</li>
                        <li>
                          <Link to={"/"}>{product.category.name}</Link>
                        </li>
                      </ul>

                      <ul className="product-links">
                        <li>Share:</li>
                        <li>
                          <Link to={"/"}>
                            <i className="fa fa-facebook"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to={"/"}>
                            <i className="fa fa-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to={"/"}>
                            <i className="fa fa-google-plus"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to={"/"}>
                            <i className="fa fa-envelope"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {/* <!-- /Product details --> */}
                  </div>
                </div>
                <Link to={`/product/${props.productId}`} onClick={handleClose}>
                  <Button bsPrefix="qv">
                    <span>View More</span>
                  </Button>
                </Link>
              </React.Fragment>
            )
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    productId: state.product_id,
    showModal: state.show_modal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
    showLogin: () => dispatch({ type: "LOGIN_CONTROL", value: true }),
    updateWishlistCount: (count) =>
      dispatch({ type: "WISHLIST_COUNT", value: count }),
    hideQuickView: () => dispatch({ type: "MODAL_CONTROL", value: false }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickView);
