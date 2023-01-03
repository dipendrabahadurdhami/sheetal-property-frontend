import Parser from "html-react-parser";

const Description = ({ data }) => {
  return (
    <div>
      {data && (
        <>
          <div className="border-b-2 border-gray-200 py-3 font-bold text-xl sm:text-2xl">
            Description
          </div>
          <div className="text-xs md:text-sm space-y-2 md:space-y-5 py-5">
            {data.property_description ? Parser(data.property_description) : ""}
          </div>

          {data.other_description && (
            <div className="text-xs md:text-sm space-y-2 md:space-y-5 py-5">
              {Parser(data?.other_description)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Description;
