
import React from "react";

const LowerFooter = () => {
  const d = new Date();

  return (
    <div className="bg-neutral-900 text-center text-white py-5 font-small">
      <p className="text-xs">&copy; {d.getFullYear()}. Sheetal Property Pvt. Ltd. All Right Reserved.</p>
     
    </div>
  );
};

export default LowerFooter;
