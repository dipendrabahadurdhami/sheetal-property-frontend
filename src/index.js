import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "./scss/styles.scss";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "./features";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <Router>
          <App />
        </Router>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
