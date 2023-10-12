import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000'
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken');
  console.log('Using token for request:', token); // Ensure token is added to headers
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

export default instance;
