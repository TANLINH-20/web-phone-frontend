import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    processOrder();
  };

  function processOrder() {
    if (props.address.presistAddress) {
      axios.post(
        "http://127.0.0.1:8000/api/user/address",
        {
          firstName: props.address.firstName,
          lastName: props.address.lastName,
          address: props.address.address,
          city: props.address.city,
          country: props.address.country,
          zip: props.address.zip,
          telephone: props.address.telephone,
          password: props.address.password,
          passwordConfirm: props.address.passwordConfirm,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/products/orders",
        {
          items: props.items,
          note: props.note,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        cleanUp();
      })
      .catch((error) => {
        setError("An error occurred while processing your order.");
        setProcessing(false);
      });
  }

  function cleanUp() {
    let checkoutList = JSON.parse(localStorage.getItem("checkoutList"));
    let cartList = JSON.parse(localStorage.getItem("cartList"));

    checkoutList = checkoutList.map((item) => item.stock_id);
    cartList = cartList.filter(
      (item) => !checkoutList.includes(item[0].stock_id)
    );

    localStorage.setItem("checkoutList", "");
    localStorage.setItem("cartList", JSON.stringify(cartList));

    updateShoppingCartCount();
  }

  function updateShoppingCartCount() {
    axios
      .get("http://127.0.0.1:8000/api/product/cart-list/count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        let localCartList = JSON.parse(localStorage.getItem("cartList"));
        let stockList = localCartList.map((list) => list[0].stock_id);

        let cartList = [...stockList, ...result.data];
        let uniqueCartList = [...new Set(cartList)];

        props.updateCartCount(uniqueCartList.length);
      });
  }

  return (
    <>
      {!succeeded ? (
        <form id="payment-form" onSubmit={handleSubmit}>
          <div>
            <strong>PAYMENT DETAILS</strong>
          </div>
          <div className="form-group">
            <input
              className="input"
              onChange={(e) => setCardHolder(e.target.value)}
              value={cardHolder}
              type="text"
              name="cardHolder"
              placeholder="Card Holder Name"
              required
            />
          </div>

          <div className="input-checkbox my-3">
            <input
              type="checkbox"
              id="terms"
              checked={checked}
              onChange={() => setChecked(!checked)}
              required
            />
            <label htmlFor="terms">
              <span></span>
              I've read and accept the <Link to={"/"}>terms & conditions</Link>
            </label>
          </div>
          <button
            className="primary-btn"
            disabled={processing || !checked}
            id="submit"
          >
            <span id="button-text">
              {processing ? "Processing..." : "Place Order"}
            </span>
          </button>
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div id="order-success">
          <i className="fa fa-check" aria-hidden="true"></i>
          <p><strong>PAYMENT SUCCESSFUL</strong></p>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
  };
};

export default connect(null, mapDispatchToProps)(CheckoutForm); 