import axios from "axios";

const timeout = 30000;

// Determine base url based on development or production mode
const baseURL = "https://www.honeycombartist.com";

const instance = axios.create({
  baseURL,
  timeout,
});

export default instance;
