// // 🔧 HARD-CODE your backend origin here:
// // const API_ROOT = "http://72.60.42.120:5501";
// // const API_ROOT = "http://localhost:5501";  
// // src/Utils/http.js
// import axios from "axios";


// const API_ROOT = "http://api.spotmyad.blackcodedev.com"; 


// const http = axios.create({
//   baseURL: `${API_ROOT.replace(/\/+$/, "")}/api`, 
//   headers: { "Content-Type": "application/json" },
//   withCredentials: false,
// });

// // ✨ NEW: attach token if present
// http.interceptors.request.use((config) => {
//   try {
//     const raw = localStorage.getItem("auth");
//     if (raw) {
//       const { token } = JSON.parse(raw) || {};
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch {}
//   return config;
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

// Auto-pick API base without env vars
function pickApiBase() {
  if (typeof window === "undefined") return "/api";
  const { protocol, hostname } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");

  if (isLocalHost && protocol === "http:") {
    return "http://127.0.0.1:5501/api";
  }
  return "/api"; // same-origin in prod
}

const http = axios.create({
  baseURL: pickApiBase().replace(/\/+$/, ""),
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

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
