import axios from "axios";
import { getToken } from "./authenticator";

const api = axios.create();

api.interceptors.request.use(async config => {
  const token = getToken();
  console.log("verificando", { token });
  if (token) {
    console.log("veri");
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
