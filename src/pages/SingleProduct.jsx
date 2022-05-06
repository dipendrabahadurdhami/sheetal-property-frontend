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
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SingleProduct = () => {
  const [open, setOpen] = useState(false);
  window.scrollTo(0, 0);
  const {id} = useParams();

  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(false);
  let isApiEnabled;
  useEffect(() => {
    FetchData();
    return () => {
      // cancel the subscription
      isApiEnabled = false;
  };
  }, [id]);


  async function FetchData() {
    setLoading(true);
    let isApiEnabled = true;
    try {
      await axios.get(
        `${process.env.REACT_APP_API_LINK}/property-detail/${id}`
      ).then(res=>{
          if(res.status === 200 && isApiEnabled){
            setProperty(res.data.data);
            setLoading(false);
          }
      }).catch(err=>{
        console.error(err)
        setLoading(false);
      })
      

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }


  return (
    <>
      {loading  && Object.keys(property).length === 0 ? (
        <div className="py-40 flex justify-center">

          <Loader/>
        </div>
      ) : (
        <>
          {!loading &&  Object.keys(property).length > 0 && (
            <>
              <UserHead setOpen={setOpen} property={property} />
              <div className="px-5 lg:px-10 py-10 pb-10">
                <ProductLocation property={property} />
                <ImageGallery property={property} />

                <Description data={property} />
                {/* <ExtraValue /> */}
                <PropertyHighlight data={property.property_highlights} />
                <Details data={property} />
                <ReviewComponent property={property} />
                <ScheduleTour property={property} />
              </div>
              <Featured />
              <Property />
              <ContactModel open={open} setOpen={setOpen} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SingleProduct;
