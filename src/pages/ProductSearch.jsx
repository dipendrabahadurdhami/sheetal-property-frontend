import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import FilterCard from "../components/card/FilterCard";
import FilterModal from "../components/ProductFilter/FilterModal";
import apiClient from '../utils/apiClient';
import ReactPaginate from 'react-paginate'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const ProductSearch = ({props}) => {
  const [params,setParams] = useSearchParams(window.location.search);
  const _params = Object.fromEntries([...params]);
  const location =  useLocation();
  // const query = params.get("tab").toLowerCase();
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);


  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(products);
    setPageCount(Math.ceil(totalProducts / itemsPerPage));

    console.log(itemOffset, itemsPerPage, totalProducts)
  }, [itemOffset, itemsPerPage, totalProducts]);


  const handlePageClick = (event) => {
    const newOffset = ((event.selected + 1)* itemsPerPage) % totalProducts;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
    setParams({..._params, page: (event.selected + 1)});
  };

 
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
     const keyword = params.get('keyword')?params.get('keyword').trim():'';
     const advertisementPurpose = params.get('advertisement_purpose')?params.get('advertisement_purpose').trim():'';
     const property_type = params.get('property_type')?params.get('property_type').trim():'';
     const min_price = params.get('min_price')?params.get('min_price').trim():0;
     const max_price = params.get('max_price')?params.get('max_price').trim():100000000;
     const price_order = params.get('price_order')?params.get('price_order').trim():'all';
     const page = params.get('page')?params.get('page'):1;
    setLoading(true);
    try{  
      await apiClient.get(`/search?
        keyword=${keyword}&
        advertisement_purpose=${advertisementPurpose}&
        min_price=${min_price}&
        max_price=${max_price}&
        price_order=${price_order}&
        property_type=${property_type}&
        page=${page === 0? 1: page}&
        itemsPerPage=${itemsPerPage}
        `).then(res=>{
        if(res.status === 200){
          // console.log(res.data)
          setProduct(res?.data?.data);
          setLoading(false);
          setItemOffset(res?.data?.meta?.current_page);
          setTotalProducts(res?.data?.meta?.total);
          

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
          <h1 className="text-2xl font-bold">Property</h1>
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

          {!loading && products && products.length === 0 && <p>No Property found!</p>}
     

        <div className="c-pagination flex justify-center">
          {/* <button className="text-white bg-red-700 font-semibold p-2 px-5 rounded">
            View More
          </button> */}
           <ReactPaginate
              breakLabel="..."
              nextLabel={<FaChevronRight/>}
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={pageCount}
              previousLabel={<FaChevronLeft/>}
              renderOnZeroPageCount={null}
              className="flex items-center"
            />
        </div>
        

       
      </div>
    </div>
  );
};

export default ProductSearch;
