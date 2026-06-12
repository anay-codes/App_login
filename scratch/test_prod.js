const http = require('https');

const data = JSON.stringify({ email: 'test@test.com', password: 'password123' });

const options = {
  hostname: 'app-login-po50.onrender.com',
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
