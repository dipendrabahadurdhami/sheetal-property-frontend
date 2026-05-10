import Parser from "html-react-parser";

const PropertyHighlight = ({ data }) => {
  if (!data) return null;
  return (
    <div>
      {Parser(data)}
    </div>
  );
};

export default PropertyHighlight;
