import axios from "axios";

const api = axios.create({
  baseURL: "https://thumblify-server-44llwvl11-afzaal-hassans-projects.vercel.app",
  withCredentials: true // ✅ sends cookies
});

export default api;
