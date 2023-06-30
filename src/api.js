import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.40:5003'
});

export default api;
