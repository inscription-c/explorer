import axios from 'axios';
import config from '@/config';

const explorerClient = axios.create({
  baseURL: config.explorerUrl,
});

explorerClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
);

export default explorerClient;
