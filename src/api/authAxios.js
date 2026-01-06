// src/api/authAxios.js
import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // refresh 쿠키 쓰면 유지
});

export default authAxios;
