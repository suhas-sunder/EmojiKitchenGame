import axios from "axios";

// Determine the base URL based on environment variables
const baseURL =
  import.meta.env.MODE === "production"
    ? `https://www.emojikitchengame.com/v1/api/tracking`
    : `http://localhost:${import.meta.env.VITE_PORT || 3200}/v1/api/tracking`;

const instance = axios.create({
  baseURL,
  timeout: 30000,
});

export default instance;
