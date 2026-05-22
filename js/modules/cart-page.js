import { CartService } from "../services/cart.service.js";
import { authGuard } from "../middleware/auth.guard.js";

/**
 * Render the HTML for the cart items
 *
 * @param {Array} items - Array of CartItemDTO objects
 * @returns {string} HTML string for the cart items
 */
const renderCartItems = (items) => {
  if (!items || items.length === 0) {
    return `<div class="cart__empty"><p>Your cart is empty.</p></div>`;
  }

  return items
    .map((item) => {
      const product = item.product || {};
      const productName = product.name || "Unknown Product";
      const productPrice = product.currentPrice || 0;
      const productImage =
        product.images && product.images.length > 0
          ? product.images[0].img_path
          : "assets/images/placeholder.png";

      // Format options like Size: Large, Color: White
      let optionsHtml = "";
      if (item.options) {
        for (const [key, value] of Object.entries(item.options)) {
          optionsHtml += `
          <p class="cart-item__variant">
            ${key}: <span class="cart-item__variant-value">${value}</span>
          </p>`;
        }
      }

      return `
      <article class="cart-item" data-id="${item.id}">
        <div class="cart-item__image-wrap">
          <img src="${productImage}" alt="${productName}" title="${productName}" class="cart-item__image" />
        </div>
        <div class="cart-item__info">
          <h2 class="cart-item__name">${productName}</h2>
          ${optionsHtml}
          <p class="cart-item__price">$${productPrice}</p>
        </div>
        <div class="cart-item__actions">
          <button type="button" class="btn btn--delete js-delete-item" aria-label="Remove item"></button>
          <div class="cart-item__quantity">
            <button type="button" class="btn btn--qty-btn js-qty-decrease">-</button>
            <input type="number" class="cart-item__qty-input js-qty-input" value="${item.quantity}" min="1" aria-label="Quantity" />
            <button type="button" class="btn btn--qty-btn js-qty-increase">+</button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");
};

/**
 * Render the HTML for the cart summary
 *
 * @param {object} cartDTO - The CartDTO object
 * @returns {string} HTML string for the cart summary list
 */
const renderSummaryList = (cartDTO) => {
  const subtotal = cartDTO.subTotal || 0;

  // Static values based on implementation plan
  const discountRate = 0.2; // 20% discount
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  // Tạm thời chưa xử lí discount
  // <li class="cart-summary__item cart-summary__item--discount">
  //   <span class="cart-summary__label">Discount (-20%)</span>
  //   <span class="cart-summary__value">-$${discount}</span>
  // </li>

  return `
    <li class="cart-summary__item">
      <span class="cart-summary__label">Subtotal</span>
      <span class="cart-summary__value">$${subtotal}</span>
    </li>
    <li class="cart-summary__item">
      <span class="cart-summary__label">Delivery Fee</span>
      <span class="cart-summary__value">$${deliveryFee}</span>
    </li>
    <div class="cart-summary__total">
      <span class="cart-summary__label">Total</span>
      <span class="cart-summary__value">$${total}</span>
    </div>
  `;
};

/**
 * Initialize the cart page module
 */
export async function initCartPage() {
  const cartContainer = document.querySelector(".cart");
  if (!cartContainer) return; // Exit if not on the cart page

  const cartItemsContainer = cartContainer.querySelector(".cart__items");
  const cartSummaryList = cartContainer.querySelector(".cart-summary__list");
  const cartSummaryTotalContainer = cartContainer.querySelector(
    ".cart-summary__total",
  );

  // Load and render cart
  const loadAndRenderCart = async () => {
    try {
      // Show a simple loading state
      if (cartItemsContainer)
        cartItemsContainer.innerHTML = "<p>Loading cart...</p>";

      const cart = await CartService.getCart();
      // Update Items
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = renderCartItems(cart.items);
      }

      // Update Summary
      if (cartSummaryList && cartSummaryTotalContainer) {
        const subtotal = cart.subTotal || 0;
        // Tạm thời chưa xử lí discount
        // const discountRate = 0.2; // 20% discount
        // const discount = Math.round(subtotal * discountRate);
        // <li class="cart-summary__item cart-summary__item--discount">
        //   <span class="cart-summary__label">Discount (-20%)</span>
        //   <span class="cart-summary__value">-$${discount}</span>
        // </li>
        const deliveryFee = 15;
        const total = subtotal + deliveryFee;

        cartSummaryList.innerHTML = `
          <li class="cart-summary__item">
            <span class="cart-summary__label">Subtotal</span>
            <span class="cart-summary__value">$${subtotal}</span>
          </li>
          <li class="cart-summary__item">
            <span class="cart-summary__label">Delivery Fee</span>
            <span class="cart-summary__value">$${deliveryFee}</span>
          </li>
        `;
        cartSummaryTotalContainer.innerHTML = `
          <span class="cart-summary__label">Total</span>
          <span class="cart-summary__value">$${total}</span>
        `;
      }
    } catch (error) {
      console.error("Failed to load cart", error);
      if (cartItemsContainer)
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
  };

  // Bind Event Delegation for cart items
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", async (e) => {
      const target = e.target;
      const cartItem = target.closest(".cart-item");
      if (!cartItem) return;

      const itemId = cartItem.dataset.id;

      // Handle Delete
      if (target.closest(".js-delete-item")) {
        try {
          await CartService.removeItem(itemId);
          await loadAndRenderCart(); // Reload the cart to ensure sync
        } catch (error) {
          alert("Failed to remove item.");
        }
      }

      // Handle Decrease Quantity
      if (target.closest(".js-qty-decrease")) {
        const input = cartItem.querySelector(".js-qty-input");
        let currentQty = parseInt(input.value, 10);
        if (currentQty > 1) {
          try {
            await CartService.updateItemQuantity(itemId, currentQty - 1);
            await loadAndRenderCart();
          } catch (error) {
            alert("Failed to update quantity.");
          }
        }
      }

      // Handle Increase Quantity
      if (target.closest(".js-qty-increase")) {
        const input = cartItem.querySelector(".js-qty-input");
        let currentQty = parseInt(input.value, 10);
        try {
          await CartService.updateItemQuantity(itemId, currentQty + 1);
          await loadAndRenderCart();
        } catch (error) {
          alert("Failed to update quantity.");
        }
      }
    });

    // Handle direct input change
    cartItemsContainer.addEventListener("change", async (e) => {
      if (e.target.classList.contains("js-qty-input")) {
        const cartItem = e.target.closest(".cart-item");
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        let newQty = parseInt(e.target.value, 10);

        if (isNaN(newQty) || newQty < 1) {
          newQty = 1;
        }

        try {
          await CartService.updateItemQuantity(itemId, newQty);
          await loadAndRenderCart();
        } catch (error) {
          alert("Failed to update quantity.");
          await loadAndRenderCart(); // Revert back to server state on error
        }
      }
    });
  }

  // Logic to handle promo code form
  const promoForm = document.querySelector(".cart-summary__promo");
  if (promoForm) {
    promoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = promoForm.querySelector(".cart-summary__promo-input");
      const promoCode = input ? input.value.trim() : "";
      if (promoCode) {
        console.log(`Applying promo code: ${promoCode}`);
        alert(`Promo code '${promoCode}' applied!`);
        input.value = ""; // clear input
      }
    });
  }

  // Logic for checkout button
  const checkoutBtn = document.querySelector(".cart-summary__checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "/order.html";
    });
  }
  // Initial load
  await loadAndRenderCart();
}
