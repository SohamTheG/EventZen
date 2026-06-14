fetch('http://localhost:8080/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(res => res.text()).then(text => console.log('Body:', text)).catch(err => console.error(err));
