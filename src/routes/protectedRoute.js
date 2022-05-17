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
import { Navigate } from "react-router-dom";
const Protected = ({  children }) => {
const user =  useSelector(state=>state.user)
const token = localStorage.getItem('sheetal_token');
// console.log(user)
 useEffect(()=>{
  if (!user.data) {
    return <Navigate to="/?login=1" replace />;
   }
 },[user])
 
 return children;
};
export default Protected;