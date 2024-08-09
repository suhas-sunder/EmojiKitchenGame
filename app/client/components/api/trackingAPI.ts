import axios from "axios";

// Determine the base URL based on environment variables
const baseURL =
  import.meta.env.MODE === "production"
    ? `http://localhost:${
        import.meta.env.VITE_API_PORT || 5173
      }/v1/api/tracking`
    : `http://localhost:${import.meta.env.VITE_PORT || 3200}/v1/api/tracking`;

console.log("Base URL:", baseURL); // Log base URL for debugging

const instance = axios.create({
  baseURL,
  timeout: 30000,
});

// Add request and response interceptors for additional logging
instance.interceptors.request.use((config) => {
  console.log("Request URL:", config.url);
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Network Error:", error.message);
    return Promise.reject(error);
  }
);

export default instance;
