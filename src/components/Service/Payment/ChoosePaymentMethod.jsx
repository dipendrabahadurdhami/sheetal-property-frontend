import React from "react";
import { MdArrowForwardIos } from "react-icons/md";

const ChoosePaymentMethod = ({ setSelect }) => {
  const rentSpace = [
    {
      name: "Credit/Debit Card",
      img: "card.png",
      description: "Credit/Debit Card",
    },
    {
      name: "Esewa",
      img: "esawa.png",
      description: "Esewa Mobile Wallet",
    },
    {
      name: "IME Pay",
      img: "imepay.png",
      description: "IME Pay Mobile Wallet",
    },
  ];
  return (
    <div className="space-y-5">
      <div className="p-5 md:p-10 text-center text-2xl md:text-4xl font-light">
        Choose Payment Method
      </div>
      <div className="md:px-28 space-y-5">
        {rentSpace.map((item) => (
          <button
            onClick={() => setSelect(4)}
            className="w-full p-4 rounded border flex space-x-5 items-center justify-between"
          >
            <div className="flex space-x-5 items-center">
              <img src={item.img} alt={item.img} className="h-10 w-12" />

              <div className="text-left font-medium">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </div>
            <div>
              <MdArrowForwardIos className="w-8 h-8 text-gray-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoosePaymentMethod;
