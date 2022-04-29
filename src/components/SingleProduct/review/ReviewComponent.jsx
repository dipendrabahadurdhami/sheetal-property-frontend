import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewComponent = () => {
  return (
    <div className="space-y-5 my-5">
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            <img
              src="/noUser.png"
              alt="noUser"
              className="w-10 h-10 rounded-full"
            />
          </span>
        </div>
        <input
          type="text"
          name="comment"
          id="comment"
          className="focus:ring-red-700 focus:border-red-700 block w-full pl-16 py-3.5 border border-gray-300 rounded-md"
          placeholder="Start the conversation..."
          aria-describedby="price-currency"
        />
      </div>
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
    </div>
  );
};

export default ReviewComponent;
