
import React from "react";

const LowerFooter = () => {
  const d = new Date();

  return (
    <div className="bg-gray-50 text-center py-5 font-medium text-md">
      <p className=" uppercase text-xs">&copy; {d.getFullYear()}. SHEETAL PROPERTY PVT. LTD. ALL RIGHTS RESERVED.</p>
      <p className="text-gray-500 text-xs">
        Developed by <a href="https://www.prabidhilabs.com" target="_blank" className="text-red-500">Prabidhi Labs</a>
      </p>
    </div>
  );
};

export default LowerFooter;
