// Mock data for recent orders
const RECENT_ORDERS = [
  {
    id: "#ORD-001",
    customer: "Olivia Martin",
    date: "2026-05-18",
    amount: "$250.00",
    status: "Completed",
    statusClass: "success"
  },
  {
    id: "#ORD-002",
    customer: "Jackson Lee",
    date: "2026-05-18",
    amount: "$120.50",
    status: "Processing",
    statusClass: "warning"
  },
  {
    id: "#ORD-003",
    customer: "Isabella Nguyen",
    date: "2026-05-17",
    amount: "$850.00",
    status: "Completed",
    statusClass: "success"
  },
  {
    id: "#ORD-004",
    customer: "William Chen",
    date: "2026-05-17",
    amount: "$45.00",
    status: "Cancelled",
    statusClass: "danger"
  }
];

/**
 * Initializes the order tags component (data table) and injects it into the DOM.
 * 
 * @param {HTMLElement} container - The DOM element where the order tags should be rendered.
 */
export function initOrderTags(container) {
  if (!container) return;

  const rowsHTML = RECENT_ORDERS.map(order => `
    <tr>
      <td class="admin-table__mono">${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td class="admin-table__mono">${order.amount}</td>
      <td><span class="admin-badge admin-badge--${order.statusClass}">${order.status}</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <section class="admin-dashboard__section">
      <div class="admin-dashboard__section-header">
        <h2>Recent Orders</h2>
      </div>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
