# Admin UI Refactoring Plan

This plan outlines the steps to refactor the `admin.html` page to load its layout and components dynamically via JavaScript, following the `js-convention.md` rules.

## Proposed Changes

### `js/admin/`

I will create a new directory dedicated to admin JavaScript modules to separate concerns from the main store.

#### [NEW] [main.js](file:///d:/Code/shopco-html/js/admin/main.js)
The entry point that will conditionally load and initialize the admin components if their respective container elements exist in the DOM.

#### [NEW] [sidebar.js](file:///d:/Code/shopco-html/js/admin/components/sidebar.js)
Will inject the HTML for the sidebar and handle its mobile toggle logic. It will target `.js-admin-sidebar-container`.

#### [NEW] [header.js](file:///d:/Code/shopco-html/js/admin/components/header.js)
Will inject the HTML for the admin header. It will target `.js-admin-header-container`.

#### [NEW] [metrics-card.js](file:///d:/Code/shopco-html/js/admin/components/metrics-card.js)
Will dynamically generate the metric cards (Total Revenue, Orders, Customers, Conversion Rate) based on an array of configuration objects. It will target `.js-admin-metrics-container`.

#### [NEW] [order-tags.js](file:///d:/Code/shopco-html/js/admin/components/order-tags.js)
Will replace the static HTML table. It will dynamically render a list/grid of order "tags" or cards instead of a traditional tabular layout. It will target `.js-admin-orders-container`.

### `admin.html`

#### [MODIFY] [admin.html](file:///d:/Code/shopco-html/admin.html)
- Remove the hardcoded HTML for the sidebar, header, metric cards, and data table.
- Replace them with semantic placeholder containers equipped with `js-` prefixed classes (e.g., `<div class="js-admin-sidebar-container"></div>`).
- Include the new ES module script: `<script type="module" src="./js/admin/main.js"></script>`.

## JS Convention Adherence
- **JS/CSS Selector Separation:** All JavaScript targeting will use `js-` prefixed classes.
- **JSDoc:** Every function will have thorough JSDoc comments.
- **Common Variables:** Configurations (like the metrics data or orders data) will be defined at the top of their respective modules.

## User Review Required
> [!IMPORTANT]
> The data table is being replaced entirely by "order tags". I plan to render these as a flex/grid layout of card-like tags (e.g., displaying the Order ID, Customer Name, and Status Badge in a compact format). Please confirm if this is what you meant by "order tags", or if you have a different visual layout in mind.

## Verification Plan

### Manual Verification
- Open `admin.html` in the browser and verify the Sidebar, Header, Metrics, and Order Tags are successfully rendered by JavaScript without flickering or layout shift.
- Test the mobile sidebar toggle.
- Inspect the DOM to ensure `js-` classes are used for JS logic and BEM classes are used strictly for styling.
