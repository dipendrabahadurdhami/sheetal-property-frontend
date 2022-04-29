import React, { useEffect, useState } from "react";
import UserHead from "../components/SingleProduct/UserHead";
import Description from "../components/SingleProduct/Description";
import Featured from "../components/home/Featured";
import Property from "../components/home/Property";
import ScheduleTour from "../components/scheduleTour/ScheduleTour";
import ContactModel from "../components/SingleProduct/ContactModel";
import ProductLocation from "../components/SingleProduct/ProductLocation";
import ImageGallery from "../components/SingleProduct/ImageGallery";
import PropertyHighlight from "../components/SingleProduct/PropertyHighlight";
import ReviewComponent from "../components/SingleProduct/review/ReviewComponent";
import Details from "../components/SingleProduct/Details";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SingleProduct = () => {
  const [open, setOpen] = useState(false);
  window.scrollTo(0, 0);
  const [params] = useSearchParams();
  const query = params.get("tab").toLowerCase();
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function FetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/all-properties`
        );
        console.log(res.data.data);
        setAllProduct(res.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    FetchData();
  }, [query]);
  console.log(query);
  console.log(allProduct);

  return (
    <>
      {loading ? (
        <div>loading.......</div>
      ) : (
        <>
          {allProduct.map((property, index) => (
            <div key={index}>
              {property.name.toLowerCase() === query && (
                <>
                  <UserHead setOpen={setOpen} property={property} />
                  <div className="px-5 lg:px-10 py-10 pb-10">
                    <ProductLocation property={property} />
                    <ImageGallery property={property} />

                    <Description property={property} />
                    {/* <ExtraValue /> */}
                    <PropertyHighlight property={property} />
                    <Details property={property} />
                    <ReviewComponent property={property} />
                    <ScheduleTour property={property} />
                  </div>
                  <Featured />
                  <Property />
                  <ContactModel open={open} setOpen={setOpen} />
                </>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default SingleProduct;
