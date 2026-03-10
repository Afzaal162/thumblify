import axios from "axios";

const api = axios.create({
  baseURL: "https://thumblify-server-smoky.vercel.app", // ✅ new backend
  withCredentials: true
});

export default api;
