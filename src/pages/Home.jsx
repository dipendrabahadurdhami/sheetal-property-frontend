import React from "react";
import MainHome from "../components/home/MainHome";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Sheetal Property Nepal — Buy, Sell & Rent Properties in Nepal</title>
        <meta name="description" content="Sheetal Property Nepal — Nepal's most trusted real estate platform. Find verified properties for sale, rent and lease in Kathmandu, Pokhara and across Nepal." />
        <meta name="keywords" content="property Nepal, real estate Nepal, house for sale Kathmandu, land for sale Nepal, flat for rent Kathmandu, buy property Nepal, Sheetal Property" />
        <link rel="canonical" href="https://sheetalproperty.com" />
        <meta property="og:title" content="Sheetal Property Nepal — Buy, Sell & Rent Properties" />
        <meta property="og:description" content="Nepal's most trusted real estate platform. Find verified properties for sale, rent and lease." />
        <meta property="og:url" content="https://sheetalproperty.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sheetal Property Nepal" />
        <meta property="og:image" content="https://sheetalproperty.com/shetallogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sheetal Property Nepal — Buy, Sell & Rent Properties" />
        <meta name="twitter:image" content="https://sheetalproperty.com/shetallogo.png" />
      </Helmet>
      <MainHome />
    </>
  );
};

export default Home;