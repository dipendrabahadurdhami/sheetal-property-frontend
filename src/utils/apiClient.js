import axios from "axios";
// import { useCookies } from "react-cookie";
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_LINK,
    headers: {
      "Content-Type": "application/json",
      "Cross-Origin-Resource-Policy": "same-site",
      "Access-Control-Allow-Origin": "admin.sheetalproperty.com",

    },
  });


  apiClient.interceptors.request.use(
     
    (config) => {
    //   const [cookie] = useCookies(['sheetal_token'])
      const token = localStorage.getItem('sheetal_token')?localStorage.getItem('sheetal_token'):''
      if (token) {
         config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  apiClient.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
    //   const originalConfig = err.config;
    //   if (originalConfig.url !== "/auth/signin" && err.response) {
    //     // Access Token was expired
    //     if (err.response.status === 401 && !originalConfig._retry) {
    //       originalConfig._retry = true;
    //       try {
    //         const rs = await instance.post("/auth/refreshtoken", {
    //           refreshToken: TokenService.getLocalRefreshToken(),
    //         });
    //         const { accessToken } = rs.data;
    //         TokenService.updateLocalAccessToken(accessToken);
    //         return instance(originalConfig);
    //       } catch (_error) {
    //         return Promise.reject(_error);
    //       }
    //     }
    //   }
      return Promise.reject(err);
    }
  );
  export default apiClient;
