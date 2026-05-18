// Configuration data for metrics
const METRICS_DATA = [
  {
    title: "Total Revenue",
    icon: "dollar-sign",
    value: "$45,231.89",
    trendText: "+20.1% from last month",
    trendDirection: "up",
    trendIcon: "trending-up"
  },
  {
    title: "Orders",
    icon: "shopping-bag",
    value: "+2350",
    trendText: "+180.1% from last month",
    trendDirection: "up",
    trendIcon: "trending-up"
  },
  {
    title: "Customers",
    icon: "users",
    value: "+12,234",
    trendText: "+19% from last month",
    trendDirection: "up",
    trendIcon: "trending-up"
  },
  {
    title: "Conversion Rate",
    icon: "activity",
    value: "3.24%",
    trendText: "-1.2% from last month",
    trendDirection: "down",
    trendIcon: "trending-down"
  }
];

/**
 * Initializes the metrics cards component and injects it into the DOM.
 * 
 * @param {HTMLElement} container - The DOM element where the metrics grid should be rendered.
 */
export function initMetricsCards(container) {
  if (!container) return;

  const cardsHTML = METRICS_DATA.map(metric => `
    <div class="admin-card">
      <div class="admin-card__header">
        <span class="admin-card__title">${metric.title}</span>
        <i data-lucide="${metric.icon}" style="width:16px;height:16px;color:#999;"></i>
      </div>
      <div class="admin-card__body">
        <div class="admin-card__value">${metric.value}</div>
        <div class="admin-card__trend admin-card__trend--${metric.trendDirection}">
          <i data-lucide="${metric.trendIcon}"></i> ${metric.trendText}
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="admin-dashboard__grid">
      ${cardsHTML}
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
