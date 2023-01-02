export const CustomRightArrow = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="absolute top-1/2 right-0 -mt-4 md:-mt-16 lg:mt-6 xl:mt-0 -translate-y-1/2 focus:outline-none"
    >
      <div className="w-[46px] h-[46px] grid place-items-center border border-black border-opacity-30 bg-white bg-opacity-80 rounded-full">
        <div className="w-4 h-3.5 opacity-60">
          <img
            src="/arrow-right.svg"
            alt="Right Arrow"
            className="w-full h-full"
          />
        </div>
      </div>
    </button>
  );
};

export const CustomLeftArrow = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="absolute top-1/2 left-0 -mt-4 md:-mt-16 lg:mt-6 xl:mt-0 -translate-y-1/2 focus:outline-none"
    >
      <div className="w-[46px] h-[46px] grid place-items-center border border-black border-opacity-30 bg-white bg-opacity-80 rounded-full">
        <div className="w-4 h-3.5 rotate-180 opacity-60">
          <img
            src="/arrow-right.svg"
            alt="Right Arrow"
            className="w-full h-full"
          />
        </div>
      </div>
    </button>
  );
};
