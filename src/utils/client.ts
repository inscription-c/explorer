import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
});

client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
);

export default client;
