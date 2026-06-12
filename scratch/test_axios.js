const axios = require('axios');
const baseURL = 'https://app-login-po50.onrender.com/api';
const url = '/api/auth/login';
console.log(axios.getUri({ baseURL, url }));
