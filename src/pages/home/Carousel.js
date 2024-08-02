import React, { Component } from "react";
import axios from "axios";
import Slider from "react-slick";
import Spinner from "react-bootstrap/Spinner";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProductItem from "../products/ProductItem";

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentCategory: 1,
      categories: [],
      products: [],
    };

    this.handleWishlist = this.handleWishlist.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getCategories();
    this.getProducts();
  }

  getCategories() {
    axios
      .get("http://127.0.0.1:8000/api/product/categories")
      .then((response) => {
        this.setState({
          categories: [...response.data],
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleWishlist(e) {
    if (!localStorage.getItem("token")) {
      this.props.showLogin();
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
            this.props.updateWishlistCount(response.data);
            toast.success("Added to wishlist!");
          }
        })
        .catch((error) => {
          toast.error("Product is already in the wishlist!");
        });
    }
  }

  async handleClick(e) {
    const id = e.target.id;

    if (e.target.className === "add-to-cart-btn") {
      this.props.showQuickView(id);
    } else if (
      e.target.className.includes('qucik-view')||
      e.target.className === "fa fa-eye"
    ) {
      this.props.showQuickView(id);
    } else {
      e.preventDefault();

      await this.setState({ currentCategory: id });
      this.getProducts();
    }
  }

  async getProducts() {
    let query = this.props.id === 1 ? "new" : "top-selling";

    this.setState({ loading: true });
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/product/categories/${this.state.currentCategory}/${query}`
      );
      this.setState({
        products: [...response.data],
        loading: false,
      },() => {
        console.log(this.state.products); // Check value after setState
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const settings = {
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
    };

    return (
      <div>
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h3 className="title">{this.props.title}</h3>
                  <div className="section-nav">
                    <ul className="section-tab-nav tab-nav">
                      {this.state.categories.map((category) => (
                        <li
                          key={category.id}
                          className={
                            category.id == this.state.currentCategory
                              ? "active"
                              : ""
                          }
                        >
                          <Link
                            id={category.id}
                            onClick={this.handleClick}
                            data-toggle="tab"
                            to="/"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {this.state.loading ? (
                <div className="spinner-container">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div id="product-container" className="col-md-12">
                  <div className="row">
                    <div className="products-tabs">
                      <div
                        id={"tab" + this.props.id}
                        className="tab-pane active"
                      >
                        <div
                          className="products-slick"
                          data-nav={"#slick-nav-" + this.props.id}
                        >
                          <Slider {...settings}>
                            {this.state.products.length > 0 &&
                              this.state.products.map((product) => (
                                <ProductItem
                                  key={product.id}
                                  product={product}
                                  handleWishlist={this.handleWishlist}
                                  handleClick={this.handleClick}
                                />
                              ))}
                          </Slider>
                        </div>
                        <div
                          id={"slick-nav-" + this.props.id}
                          className="products-slick-nav"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productId: state.product_id,
    showModal: state.show_modal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showQuickView: (id) => dispatch({ type: "QUICKVIEW_CONTROL", value: id }),
    showLogin: () => dispatch({ type: "LOGIN_CONTROL", value: true }),
    updateWishlistCount: (count) =>
      dispatch({ type: "WISHLIST_COUNT", value: count }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Carousel);
