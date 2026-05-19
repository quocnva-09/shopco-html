import { CartService } from "../services/cart.service.js";
import { OrderService } from "../services/order.service.js";
import { UserService } from "../services/user.service.js";

export const initOrderPage = () => {
  const wrapperEl = document.querySelector(".js-order-wrapper");
  if (!wrapperEl) return;

  const formEl = document.querySelector(".js-order-form");
  const addressInput = document.querySelector(".js-order-address");
  const phoneInput = document.querySelector(".js-order-phone");
  const itemsContainer = document.querySelector(".js-order-items");
  const checkoutBtn = document.querySelector(".js-checkout-btn");
  const successOverlay = document.querySelector(".js-order-success-overlay");

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (addressInput && user.address && user.address !== "No address") {
          addressInput.value = user.address;
        }
        if (phoneInput && user.phone && user.phone !== "No phone") {
          phoneInput.value = user.phone;
        }
      } catch (e) {
        console.error("Failed to parse user info:", e);
      }
    }
  };

  const renderCartItems = async () => {
    const cart = await CartService.getCart();
    if (!cart) {
      itemsContainer.innerHTML = `<p class="order-items__empty">Your cart is empty.</p>`;
      checkoutBtn.disabled = true;
      return;
    }

    let itemsHtml = "";
    cart.items.forEach((item) => {
      // using default or standard product image if needed
      const productPrice =
        item.product.currentPrice !== null
          ? item.product.currentPrice
          : item.product.originalPrice;
      itemsHtml += `
        <div class="order-item">
          <img class="order-item__image" src="${item.product.images[0].img_path}" alt="${item.product.name}" />
          <div class="order-item__info">
            <h3 class="order-item__name">${item.product.name}</h3>
            <p class="order-item__variant">Size: ${item.options.sizes} | Color: ${item.options.colors}</p>
            <p class="order-item__price">${formatMoney(productPrice)} x ${item.quantity}</p>
          </div>
          <div class="order-item__total">
            ${formatMoney(productPrice * item.quantity)}
          </div>
        </div>
      `;
    });

    itemsContainer.innerHTML = itemsHtml;

    // Calculate totals based on cart total
    const subtotalEl = document.querySelector(".js-order-subtotal");
    const totalItemsEl = document.querySelector(".js-order-total-items");
    const discountEl = document.querySelector(".js-order-discount");
    const deliveryEl = document.querySelector(".js-order-delivery");
    const totalEl = document.querySelector(".js-order-total");

    const totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const subtotal = cart.items.reduce((sum, item) => {
      const productPrice =
        item.product.currentPrice !== null
          ? item.product.currentPrice
          : item.product.originalPrice;
      return sum + productPrice * item.quantity;
    }, 0);

    // Simplistic calculation for demo if backend doesn't provide it
    // const discount = subtotal * 0.2; // 20% discount
    const delivery = 15;
    const finalTotal = subtotal + delivery;

    if (totalItemsEl) totalItemsEl.textContent = totalQuantity;
    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    // if (discountEl) discountEl.textContent = "-" + formatMoney(discount);
    if (deliveryEl) deliveryEl.textContent = formatMoney(delivery);
    if (totalEl) totalEl.textContent = formatMoney(finalTotal);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (checkoutBtn.disabled) return;

    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Processing...";

    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr);

    // Update user info
    if (user) {
      const updateRes = await UserService.updateProfile(user.id, {
        address,
        phone,
      });
      if (!updateRes.success) {
        alert("Failed to update shipping information: " + updateRes.error);
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Go to Checkout →";
        return;
      }
    }

    // Create Order
    const orderRes = await OrderService.createOrder();
    if (orderRes.success) {
      // Clear cart on success
      await CartService.clearCart();
      // Show success overlay
      if (successOverlay) {
        successOverlay.style.display = "flex";
      }
    } else {
      alert("Failed to create order: " + orderRes.error);
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Go to Checkout →";
    }
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }

  // Init
  renderUserInfo();
  renderCartItems();
};
