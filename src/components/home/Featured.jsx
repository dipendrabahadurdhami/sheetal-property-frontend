import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const Featured = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    async function FetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/featured-property-list`
        );
        setAllProduct(res.data.data);
      } catch (e) {
        console.error("Featured fetch error:", e);
      }
    }
    FetchData();
  }, []);

  return (
    <section className="ab py-10 md:py-16 px-5 container mx-auto">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="lbl">
            <div className="lbl-line" />
            <span className="lbl-txt">Handpicked for you</span>
          </div>
          <h2 className="h-lg serif">Featured Properties</h2>
        </div>
        <Link
          to="/properties?type=featured-properties"
          className="btn-g hidden md:inline-flex items-center gap-2"
          style={{ fontSize: "12px", padding: "10px 20px" }}
        >
          View All
          <img src="/arrow-right.svg" alt="" className="w-4 h-4" />
        </Link>
      </div>

      {/* RED DIVIDER */}
      <div style={{ height: "1px", width: "48px", background: "var(--r)", margin: "12px 0 28px" }} />

      {/* FIRST ROW */}
      <div className="-mx-2">
        <Carousel
          responsive={responsive}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          className="py-3 md:pb-10"
        >
          {[...allProduct].slice(0, 4).map((product, index) => (
            <div key={index} className="h-full px-2 mb-2">
              <FearuredCard product={product} />
            </div>
          ))}
        </Carousel>
      </div>

      {/* SECOND ROW */}
      {allProduct.length > 4 && (
        <div className="-mx-2 mt-2">
          <Carousel
            responsive={responsive}
            customRightArrow={<CustomRightArrow />}
            customLeftArrow={<CustomLeftArrow />}
            className="py-3 md:pb-10"
          >
            {[...allProduct].slice(4).map((product, index) => (
              <div key={index} className="h-full px-2 mb-2">
                <FearuredCard product={product} />
              </div>
            ))}
          </Carousel>

          {/* MOBILE VIEW ALL */}
          <div className="flex justify-end mt-6 md:hidden">
            <Link
              to="/properties?type=featured-properties"
              className="btn-g flex items-center gap-2"
              style={{ fontSize: "12px", padding: "10px 20px" }}
            >
              View All
              <img src="/arrow-right.svg" alt="" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {allProduct.length === 0 && (
        <div className="text-center py-20">
          <p style={{ color: "var(--d)", opacity: 0.35, fontSize: "14px" }}>
            No featured properties at the moment.
          </p>
        </div>
      )}

    </section>
  );
};

export default Featured;