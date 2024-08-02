// Main.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import QuickView from "../pages/home/QuickView";
import Header from "./Header";
import Footer from "./Footer";
import Nav from "./Nav";
const Main = () => {
  return (
    <div>
      <QuickView />
      <Header />
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Main;
