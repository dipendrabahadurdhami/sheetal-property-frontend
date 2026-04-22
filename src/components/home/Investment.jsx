import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const API_BASE = process.env.REACT_APP_API_LINK;

const Investment = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    async function FetchData() {
      try {
        const res = await axios.get(`${API_BASE}/invest`);

        if (res.data && res.data.data) {
          setAllProduct(res.data.data);
        } else {
          setAllProduct([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setAllProduct([]);
      }
    }
    FetchData();
  }, []);

  return (
    <div className="pt-4 xl:pt-6 px-5 container mx-auto">
      <div className="">
        <h1 className="pb-3 text-2xl">Investment</h1>
        <p className="bg-red-700 h-1 w-16"></p>
      </div>

      <div className="py-4 md:py-4 md:pb-2 -mx-4">
        <Carousel
          responsive={responsive}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          className="py-3 md:pb-10"
        >
          {(allProduct || []).slice(0, 4).map((product, index) => (
            <div key={index} className="h-full px-0 mb-2">
              <FearuredCard product={product} />
            </div>
          ))}
        </Carousel>
      </div>

      {allProduct?.length > 4 && (
        <div className="py-4 md:py-4 md:pb-2 -mx-4">
          <Carousel
            responsive={responsive}
            customRightArrow={<CustomRightArrow />}
            customLeftArrow={<CustomLeftArrow />}
            className="py-3 md:pb-10"
          >
            {(allProduct || []).slice(4, allProduct.length).map((product, index) => (
              <div key={index} className="h-full px-0 mb-2">
                <FearuredCard product={product} />
              </div>
            ))}
          </Carousel>
          <div className="flex justify-end mt-8 md:mt-0">
            <Link
              to="/productSearch?advertisement_purpose=Invest"
              className="flex space-x-2 items-center"
            >
              <div>View All</div>
              <div className="w-6 h-[21px]">
                <img src="/arrow-right.svg" alt="" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investment;