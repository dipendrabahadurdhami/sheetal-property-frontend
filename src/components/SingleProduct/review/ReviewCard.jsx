import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ReviewCard = () => {
  const [like, setLike] = useState(true);
  return (
    <div className="relative border p-5 rounded-lg">
      <div className="relative flex justify-between flex-row-reverse items-center mb-5 sm:block">
        <button
          onClick={() => setLike(!like)}
          className="sm:absolute right-3 top-3 sm:border rounded-lg border-red-700 sm:p-2 flex items-center text-red-700 space-x-3 text-sm"
        >
          {like ? (
            <AiFillHeart className="w-6 h-6 text-red-700" />
          ) : (
            <AiOutlineHeart className="w-6 h-6 text-red-700" />
          )}
          <span>35</span>
        </button>
        <div className="flex items-center space-x-2">
          <div>
            <img
              src="/noUser.png"
              alt="noUser"
              className="rounded-full w-12 h-12"
            />
          </div>
          <div>
            <div className="font-medium">Ram Ghanshyam</div>
            <div className="font-light text-gray-700 text-sm">5 hours ago</div>
          </div>
        </div>
      </div>
      <div className="text-xs sm:text-sm lg:w-10/12">
        Astonishing house closed to ringroad. It is surrounded by friendly
        neighbourhood. It holds symbolic value and brings good luck to its
        residence. Flat on rent at Battisputali / Purano Baneshwor, Kathmandu
        Mahanagarpalika-09. This flat is located in 1.5 minute walking distance
        from Golden Gate International College and 5 minute walking distance
        from Gaushala to Purano Baneshwor Highway. This flat is only suitable
        for residential purpose.
      </div>
      <div className="flex justify-end items-center mt-2 space-x-3">
        <button className="text-red-700 p-2 px-5 rounded-lg font-medium">
          Delete
        </button>
        <button className="bg-red-700 text-white p-2 px-6 rounded-lg">
          Edit
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
