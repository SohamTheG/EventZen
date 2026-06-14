const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcklkIjoyLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3ODA4MjUxODAsImV4cCI6MTc4MDkxMTU4MH0.2UmNYJ3r4WQVYrFOZeZII9rkj8gGx5U0tsgDZ5A_CWw';
const headers = { 'Authorization': 'Bearer ' + token };

Promise.all([
  fetch('http://localhost:8080/api/vendors', { headers }).then(r => r.status),
  fetch('http://localhost:8080/api/bookings', { headers }).then(r => r.status),
  fetch('http://localhost:8080/api/attendees/all', { headers }).then(r => r.status)
]).then(results => {
  console.log('Vendors:', results[0]);
  console.log('Bookings:', results[1]);
  console.log('Attendees:', results[2]);
});
