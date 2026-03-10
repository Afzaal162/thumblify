import axios from "axios";

const api = axios.create({
  baseURL: "https://thumblify-server-smoky.vercel.app",
  withCredentials: true // ⚠️ critical for session cookies
});

export default api;
