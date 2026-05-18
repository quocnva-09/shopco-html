// middleware/guest.guard.js

const token = localStorage.getItem("access_token");

if (token) {
  window.location.replace("/index.html");
}
