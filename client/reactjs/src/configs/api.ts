import axios from "axios";

const api = axios.create({
  baseURL: "https://thumblify-server-smoky.vercel.app", // your live backend
  withCredentials: true // send cookies with requests
});

export default api;
