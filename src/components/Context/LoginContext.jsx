import React, { useState } from "react";

export const LoggedUserContext = React.createContext({
  //   userData: null,
  //   setUserData: (e) => e,
  token: null,
  setToken: (e) => e,
});

export const LoggedUserContextProvider = ({ children }) => {
  //   const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  const values = {
    // userData,
    // setUserData,
    token,
    setToken,
  };

  return (
    <LoggedUserContext.Provider value={values}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export default LoggedUserContextProvider;
