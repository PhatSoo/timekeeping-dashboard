import axios from 'axios';

const apiManager = axios.create({
  baseURL: `${process.env.API_SERVER}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiManager;
