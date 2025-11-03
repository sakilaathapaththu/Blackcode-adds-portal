// // src/Utils/http.js
// import axios from "axios";

// // 🔧 HARD-CODE your backend origin here:
// const API_ROOT = "http://localhost:5000"; 

// const http = axios.create({
//   baseURL: `${API_ROOT.replace(/\/+$/, "")}/api`, // -> http://localhost:5000/api
//   headers: { "Content-Type": "application/json" },
//   withCredentials: false,
// });

// http.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const msg =
//       err?.response?.data?.message ||
//       err?.response?.data?.error ||
//       err?.message ||
//       "Request failed";
//     return Promise.reject({ ...err, message: msg });
//   }
// );

// export default http;
// src/Utils/http.js
import axios from "axios";

// 🔧 HARD-CODE your backend origin here:
const API_ROOT = "http://72.60.42.120:5501"; 
// const API_ROOT = "http://localhost:5501"; 
const http = axios.create({
  baseURL: `${API_ROOT.replace(/\/+$/, "")}/api`, // -> http://localhost:5000/api
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ✨ NEW: attach token if present
http.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const { token } = JSON.parse(raw) || {};
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Request failed";
    return Promise.reject({ ...err, message: msg });
  }
);


export default http;
