// src/Utils/http.js
import axios from "axios";

// 🔧 HARD-CODE your backend origin here:
const API_ROOT = "http://localhost:5000"; 

const http = axios.create({
  baseURL: `${API_ROOT.replace(/\/+$/, "")}/api`, // -> http://localhost:5000/api
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
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
