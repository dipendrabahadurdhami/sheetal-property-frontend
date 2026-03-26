import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_LINK,
  headers: {
    // REMOVED "Content-Type": "application/json"
    "Accept": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sheetal_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // SMART CHECK: If we are sending FormData (images), 
    // let the browser set the Content-Type. 
    // Otherwise, default to JSON for normal API calls.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("sheetal_token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;