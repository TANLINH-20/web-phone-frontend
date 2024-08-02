import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../pages/productDetail/Header";
import Main from "../pages/productDetail/Main";
import RelatedProducts from "../pages/productDetail/RelatedProducts";
import ProductTab from "../pages/productDetail/ProductTab";

function ProductDetail(props) {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [loading, setloading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartButtonInit, setCartButtonInit] = useState(true);
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState("");
  const [productCate, setProductCate] = useState("");
  const [stocks, setStocks] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cartCount, setCartCount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [avaibleQuantity, setAvaibleQuantity] = useState("0");
  const [settings] = useState({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  const [settingsRealtedProduct] = useState({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  useEffect(() => {
    getProduct(id);
  }, [id]);

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
        getProductCate(response.data.category_id);
        setloading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setloading(false);
      });
  }

  function getProductCate(category_id) {
    setloading(true);
    setProductCate("");
    axios
      .get(`http://127.0.0.1:8000/api/product/categories/${category_id}/new`)
      .then((response) => {
        setProductCate(response.data);
        setloading(false);
      })
      .catch((error) => {
        console.error("Error fetching product category:", error);
        setloading(false);
      });
  }
  const handleClickCate = (e) => {
    const { id, className } = e.target;

    if (
      className.includes("add-to-cart-btn") ||
      className.includes("qucik-view") ||
      className.includes("fa-eye")
    ) {
      props.showQuickView(id);
    }
  };

  function handleClick() {
    setCartLoading(true);
    setCartButtonInit(false);

    let stock = stocks.find(
      (item) => item.size === selectedSize && item.color === selectedColor
    );
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
          toast.success("Added to cart")
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

        items.map((item) => {
          if (item[0].stock_id == stock.id) {
            if (avaibleQuantity > item[0].quantity + quantity)
              item[0].quantity += quantity;
            else item[0].quantity = avaibleQuantity;

            cartItem = "";
          }
        });
      }

      if (cartItem) items.unshift(cartItem);

      setCartCount(items.length);
      localStorage.setItem("cartList", JSON.stringify(items));
      setCartLoading(false);
    }
    props.updateCartCount(cartCount);
  }

  function handleChange(e) {
    const value = e.target.value;

    if (e.target.className === "m-2 input-select") {
      var found = false;
      stocks.map((stock) => {
        if (stock.size == value && !found) {
          setSelectedSize(value);
          setAvaibleQuantity(stock.quantity);
          found = true;
        }
        if (stock.color == value) {
          setSelectedColor(value);
          setAvaibleQuantity(stock.quantity);
          console.log(stock.quantity);
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
            product_id: product.id,
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

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }
  return (
    <div>
      <Header productName={product.name} />
      <Main
        product={product}
        stocks={stocks}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        avaibleQuantity={avaibleQuantity}
        quantity={quantity}
        cartButtonInit={cartButtonInit}
        cartLoading={cartLoading}
        settings={settings}
        handleChange={handleChange}
        handleClick={handleClick}
        handleMouseLeave={handleMouseLeave}
        handleWishlist={handleWishlist}
      />
      <ProductTab 
        product={product}
      />
      <RelatedProducts
        loading={loading}
        productCate={productCate}
        settingsRealtedProduct={settingsRealtedProduct}
        handleWishlist={handleWishlist}
        handleClickCate={handleClickCate}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  productId: state.product_id,
  showModal: state.show_modal,
});

const mapDispatchToProps = (dispatch) => ({
  updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
  showQuickView: (id) => dispatch({ type: "QUICKVIEW_CONTROL", value: id }),
  showLogin: () => dispatch({ type: "LOGIN_CONTROL", value: true }),
  updateWishlistCount: (count) =>
    dispatch({ type: "WISHLIST_COUNT", value: count }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
