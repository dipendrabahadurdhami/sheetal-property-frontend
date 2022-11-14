import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("sheetal_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.data && !token) {
      return navigate(`/?login=1`);
    }
  }, [user]);

  return children;
};
export default Protected;
