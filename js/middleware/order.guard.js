// middleware/order.guard.js
const token = localStorage.getItem("access_token");
if (!token) {
  window.location.replace("/login.html");
}

const referrer = document.referrer;
if (!referrer.includes("cart.html")) {
  alert("You need to go to cart before checkout!");
  window.location.replace("/cart.html");
}
