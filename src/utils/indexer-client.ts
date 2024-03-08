import axios from 'axios';
import config from '@/config';

const indexerClient = axios.create({
  baseURL: config.indexerUrl,
});

indexerClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
);

export default indexerClient;
