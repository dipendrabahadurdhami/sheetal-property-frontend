import React from "react";
import ReactDOM from "react-dom";

// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LoggedUserContextProvider from "./components/Context/LoginContext";


import 'react-toastify/dist/ReactToastify.css';
import './scss/styles.scss'
import { CookiesProvider } from 'react-cookie';
import { Provider } from "react-redux";
import {store} from './features';
ReactDOM.render(
  <React.StrictMode>
    {/* <LoggedUserContextProvider> */}
      <Provider store={store}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Provider>
    {/* </LoggedUserContextProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
