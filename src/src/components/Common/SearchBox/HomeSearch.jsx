import React from "react";
import InputBox from "./InputBox";

const HomeSearch = ({ setFilterModal, showFilters = true, activeTab, navigateOnFilter = false }) => {
  return (
    <InputBox
      showFilters={showFilters}
      setFilterModal={setFilterModal}
      activeTab={activeTab}
      navigateOnFilter={navigateOnFilter}
    />
  );
};

export default HomeSearch;