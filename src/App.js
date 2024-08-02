// App.jsx
import React from "react";
import "./assets/sass/app.scss"; // Import stylesheet
import "bootstrap-icons/font/bootstrap-icons.css";
import Main from "./layouts/Main";
import { Route, Routes } from "react-router-dom";
import Home from "./layouts/Home";
import ProductPage from "./pages/products/ProductPage";
import ProductDetail from "./layouts/ProductDetail";
import Wishlist from "./pages/home/Wishlist";
import ShoppingCart from "./pages/cart/ShoppingCart";
import Checkout from "./pages/cart/Checkout";
import About from "./pages/about/About";
import News from "./pages/news/News";
import Contact from "./pages/contact/Contact";
import Feedback from "./pages/feedback/Feedback";
import DashboardMain from "./layouts/DashboardMain";
import DashboardHome from "./pages/dashboardHome/DashboardHome";
import DashboardProducts from "./pages/dashboardProducts/DashboardProducts";
import DashboardNewProduct from "./pages/dashboardProducts/DashboardNewProduct";
import DashboardNewCategory from "./pages/dashboardCategories/DashboardNewCategory";
import DashboardCategories from "./pages/dashboardCategories/DashboardCategories";
import DashboardUpdateProduct from "./pages/dashboardProducts/DashboardUpdateProduct";
import DashboardUpdateCategory from "./pages/dashboardCategories/DashboardUpdateCategory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route
          path="/product"
          element={<ProductPage title={"Danh mục sản phẩm"} />}
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thong-tin" element={<About />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/phan-hoi" element={<Feedback />} />
      </Route>
      <Route path="/dashboard" element={<DashboardMain />}>
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="new-product" element={<DashboardNewProduct />} />
        <Route path="categories" element={<DashboardCategories />} />
        <Route path="new-category" element={<DashboardNewCategory />} />
        <Route path="products/update/:id" element={<DashboardUpdateProduct />} />
        <Route path="categories/update/:id" element={<DashboardUpdateCategory />} />
      </Route>
    </Routes>
  );
}

export default App;
