import React from "react";
import Collection from "../pages/home/Collection";
import Carousel from "../pages/home/Carousel";
import HotDeals from "../pages/home/HotDeals";
import Widgets from "../pages/home/Widgets";

function Home(props) {
  return (
    <div>
      <Collection />
      <Carousel title="New Products" id={1} />
      <HotDeals />
      <Carousel title="Top Selling" id={2} />
      <Widgets />
    </div>
  );
}

export default Home;
