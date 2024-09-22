import axios from "axios";
import { AuthResponse } from "../models/AuthResponse";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

  return config;
});

$api.interceptors.request.use(
  (config) => {
    return config;
  },
  async (error) => {
    const origRequest = error.config;

    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      origRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });

        localStorage.setItem("token", response.data.accessToken);

        return $api.request(origRequest);
      } catch (e) {
        console.log("Користувача не авторизовано");
      }
    }

    throw error;
  }
);

export default $api;
