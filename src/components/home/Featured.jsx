import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const Featured = () => {
  const [allProduct, setAllProduct] = useState([]);
  useEffect(() => {
    try {
      async function FetchData() {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/all-properties`
        );

        setAllProduct(res.data.data);
      }
      FetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="pt-16 px-5 md:px-10">
      <div className="">
        <h1 className="pb-3 text-3xl">Featured Properties</h1>
        <p className="bg-red-700 h-1 w-16"></p>
      </div>

      <div className="py-10 md:py-16">
        <Carousel
          responsive={responsive}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          className="pb-16 pt-5"
        >
          {allProduct.map((product, index) => (
            <div key={index}>
              <FearuredCard product={product} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Featured;
