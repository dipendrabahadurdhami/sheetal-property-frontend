import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import FilterCard from "../components/card/FilterCard";
import FilterModal from "../components/ProductFilter/FilterModal";
import apiClient from '../utils/apiClient';
const ProductSearch = ({props}) => {
  const [params] = useSearchParams(window.location.search);
  const location =  useLocation();
  // const query = params.get("tab").toLowerCase();
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

 
  // useEffect(() => {
  //   try {
  //     setLoading(true);
  //     async function FetchData() {
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_API_LINK}/${query}`
  //       );
  //       console.log(res.data.data);
  //       setProduct(res.data.data);
  //     }
  //     FetchData();
  //     setLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // }, [query]);


  const fetchSearch = async () => {
     const keyword = params.get('keyword')?params.get('keyword'):'';
     const advertisementPurpose = params.get('advertisement_purpose')?params.get('advertisement_purpose'):'';
     const min_price = params.get('min_price')?params.get('min_price'):'';
     const max_price = params.get('max_price')?params.get('max_price'):'';
    setLoading(true);
    try{  
      await apiClient.get(`/search?keyword=${keyword}&advertisement_purpose=${advertisementPurpose}&min_price=${min_price}&max_price=${max_price}`).then(res=>{
        if(res.status === 200){
          // console.log(res.data)
          setProduct(res?.data?.data);
          setLoading(false);
        }
      }).catch(err=>{

        setLoading(false);
        console.error(err)
      })
    }catch(err){
      setLoading(false);
      console.error(err)
    }


  }

  useEffect(()=>{
    fetchSearch();
  }, [params])

  return (
    <div className="p-5 lg:p-10 space-y-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Property on </h1>
          <FilterModal />
        </div>

          {loading ? (
            <div>Loading .....</div>
          ) : (
            <>
              {products && products.map((property, index) => (
                <div key={index} className="mb-6">
                  
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
    </div>
  );
};

export default ProductSearch;
