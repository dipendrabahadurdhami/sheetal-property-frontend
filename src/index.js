import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./scss/styles.scss";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "./features";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <Router>
          <App />
        </Router>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);