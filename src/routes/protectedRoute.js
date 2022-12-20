import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("sheetal_token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.data && !token) {
      return navigate(`/?login=1`);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return null;

  return children;
};
export default Protected;
