import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterCard from "../components/card/FilterCard";
import FilterModal from "../components/ProductFilter/FilterModal";

const ProductSearch = () => {
  const [params] = useSearchParams();
  const query = params.get("tab").toLowerCase();
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      setLoading(true);
      async function FetchData() {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/${query}`
        );
        console.log(res.data.data);
        setProduct(res.data.data);
      }
      FetchData();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="p-5 lg:p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Property on {query}</h1>
        <FilterModal />
      </div>
      {loading ? (
        <div>Loading .....</div>
      ) : (
        <>
          {products.map((property, index) => (
            <div key={index}>
              <FilterCard property={property} />
            </div>
          ))}
        </>
      )}

      <div className="flex justify-center">
        <button className="text-white bg-red-700 font-semibold p-2 px-5 rounded">
          View More
        </button>
      </div>
    </div>
  );
};

export default ProductSearch;
