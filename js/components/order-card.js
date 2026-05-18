export const generateOrderCardHTML = (order) => {
  let statusClass = "order-card__badge--pending";
  if (order.status.toLowerCase() === "paid") {
    statusClass = "order-card__badge--paid";
  } else if (order.status.toLowerCase() === "cancelled") {
    statusClass = "order-card__badge--cancelled";
  } else if (order.status.toLowerCase() === "delivered") {
    statusClass = "order-card__badge--delivered";
  }

  const itemsHTML = order.items.map(item => `
    <div class="order-card__item">
      <div class="order-card__image-wrap">
        <img src="${item.product.imageUrl}" alt="${item.product.name}" class="order-card__image" />
      </div>
      <div class="order-card__item-info">
        <h4 class="order-card__product-name">${item.product.name}</h4>
        <p class="order-card__product-options">${item.formattedOptions}</p>
        <div class="order-card__price-qty">
          <span class="order-card__price">$${item.price}</span>
          <span class="order-card__qty">Qty: ${item.quantity}</span>
        </div>
      </div>
      <div class="order-card__item-total">
        $${item.totalMoney}
      </div>
    </div>
  `).join("");

  return `
    <div class="order-card">
      <div class="order-card__header">
        <div class="order-card__id-date">
          <span class="order-card__id">Order #${order.id}</span>
          <span class="order-card__date">${order.formattedDate}</span>
        </div>
        <div class="order-card__status">
          <span class="order-card__badge ${statusClass}">${order.statusLabel}</span>
        </div>
      </div>
      <div class="order-card__items">
        ${itemsHTML}
      </div>
      <div class="order-card__footer">
        <span class="order-card__total-label">Total Amount:</span>
        <span class="order-card__total-value">$${order.totalAmount}</span>
      </div>
    </div>
  `;
};
