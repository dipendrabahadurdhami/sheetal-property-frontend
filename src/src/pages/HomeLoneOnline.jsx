import React from "react";
import ApplyOnilne from "../components/Service/HomeLone/ApplyOnilne";
import SEO from "../components/SEO/SEO";

const HomeLoneOnline = () => {
  return (
    <div className="space-y-10 py-10">
      <SEO
        title="Apply for Home Loan Online - Nepal"
        description="Apply for a home loan online in Nepal quickly and securely through Sheetal Property Nepal's partner banks."
        keywords="apply home loan online Nepal, Nepal housing loan application, online mortgage application Nepal"
        path="/homeLone/applyOnline"
      />
      <div className="text-center font-semibold text-xl">
        Apply for Home Loan
      </div>
      <ApplyOnilne />
    </div>
  );
};

export default HomeLoneOnline;
