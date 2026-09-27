import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterCard from "../components/card/FilterCard";
import apiClient from "../utils/apiClient";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import headTag from "../headTag";
import axios from "axios";
import SEO from "../components/SEO/SEO";

const AllProperties = () => {
  const [params, setParams] = useSearchParams(window.location.search);

  const _params = Object.fromEntries([...params]);

  const propertyType = _params?.type;

  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const itemsPerPage = 12;

  const handlePageClick = (event) => {
    const newOffset = ((event.selected + 1) * itemsPerPage) % totalProducts;
    setItemOffset(newOffset);
    setParams({ ..._params, page: event.selected + 1 });
  };

  useEffect(() => {
    const controller = new AbortController();
    const page = params.get("page") ? params.get("page") : 1;

    let url;
    if (propertyType === "featured-properties") {
      url = "/featured-property-list";
    } else if (propertyType === "latest-properties") {
      url = "/all-properties";
    }

    if (!url) {
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    apiClient
      .get(`${url}?page=${page}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 200) {
          setProduct(res?.data?.data);
          setItemOffset(res?.data?.meta?.current_page);
          setTotalProducts(res?.data?.meta?.total);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [params]);

  let title = "";

  if (propertyType === "featured-properties") {
    title = "Featured Properties";
  } else if (propertyType === "latest-properties") {
    title = "Latest Properties";
  }

  useEffect(() => {
    headTag({
      title,
    });
    // eslint-disable-next-line
  }, []);

  if (
    propertyType !== "featured-properties" &&
    propertyType !== "latest-properties"
  ) {
    return <div></div>;
  }

  return (
    <div className="p-5 lg:p-10 space-y-10">
      <SEO
        title={`${title || "All Properties"} in Nepal - Buy, Sell & Rent`}
        description="Browse verified properties for sale and rent across Nepal — houses, land, apartments and commercial spaces. Trusted by buyers and investors from Nepal, India and Dubai."
        keywords="properties in Nepal, houses for sale Nepal, land for sale Nepal, apartments for rent Nepal, property Kathmandu, real estate Nepal"
        path="/properties"
      />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        {loading ? (
          <div>Loading .....</div>
        ) : (
          <>
            {products &&
              products.map((property, index) => (
                <div key={index} className="mb-24">
                  <FilterCard property={property} />
                </div>
              ))}
          </>
        )}

        {!loading && products && products.length === 0 && (
          <p>No Property found!</p>
        )}

        <div className="c-pagination flex justify-center">
          {/* <button className="text-white bg-red-700 font-semibold p-2 px-5 rounded">
            View More
          </button> */}
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaChevronRight />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel={<FaChevronLeft />}
            renderOnZeroPageCount={null}
            className="flex items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AllProperties;
