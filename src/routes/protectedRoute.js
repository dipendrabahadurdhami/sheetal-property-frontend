import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("sheetal_token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (token && !user.data) {
      setLoading(true);
      return;
    }


    if (!token && !user.data) {

      if (location.pathname !== "/") {
        return navigate(`/?login=1`);
      }
    }

    setLoading(false);
  }, [user, token, navigate, location.pathname]);

  if (loading) return null;

  return children;
};
export default Protected;