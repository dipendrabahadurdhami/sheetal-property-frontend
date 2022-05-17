// import React from "react";
// import { Redirect, Route } from "react-router-dom";

// function ProtectedRoute({ component: Component, ...restOfProps }) {
//   const isAuthenticated = localStorage.getItem("isAuthenticated");
//   console.log("this", isAuthenticated);

//   return (
//     <Route
//       {...restOfProps}
//       render={(props) =>
//         isAuthenticated ? <Component {...props} /> : <Redirect to="/signin" />
//       }
//     />
//   );
// }

// export default ProtectedRoute;


import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({  children }) => {
const user =  useSelector(state=>state.user)
const token = localStorage.getItem('sheetal_token');
const navigate = useNavigate()
// console.log(user)
 useEffect(()=>{
  if (!user.data && !token) {
    return  navigate(`/?login=1`)
   }
 },[user])
 
 return children;
};
export default Protected;