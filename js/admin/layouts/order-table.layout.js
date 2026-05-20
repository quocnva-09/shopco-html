import { escapeHtml } from '../../utils/table-layout.util.js';

/**
 * Builds the HTML structure for a single order row in the admin list.
 *
 * @param {OrderDTO} order - The order DTO object.
 * @returns {string} The HTML string for the table row.
 */
export function buildOrderRow(order) {
    const status = order.status || 'pending';
    const statusLabel = order.statusLabel || 'Pending';

    let statusStyle = '';
    if (status === 'pending') {
        statusStyle = 'background: #fef3c7; color: #920e66ff;';
    } else if (status === 'paid') {
        statusStyle = 'background: #dcfce3; color: #166534;';
    } else {
        statusStyle = 'background: #fee2e2; color: #991b1b;';
    }

    const itemCount = order.items ? order.items.length : 0;
    const itemsSummary = order.items
        ? order.items.map(
            (i) => `${i.product?.name || 'Product'} (x${i.quantity})`
        ).join(', ')
        : '';

    return `
        <tr>
            <td>
                <div class="data-table__meta">
                    <span>Order #${order.id}</span>
                    <span class="data-table__email">
                        ${escapeHtml(order.formattedDate)}
                    </span>
                </div>
            </td>
            <td>$${order.totalAmount}</td>
            <td>
                <span class="data-table__meta">
                    <span>${itemCount} Items</span>
                    <span class="data-table__email" style="
                        max-width: 250px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    " title="${escapeHtml(itemsSummary)}">
                        ${escapeHtml(itemsSummary)}
                    </span>
                </span>
            </td>
            <td>
                <span style="
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    ${statusStyle}
                ">
                    ${escapeHtml(statusLabel)}
                </span>
            </td>
            <td>
                <div class="action-group">
                    <button
                        class="action-btn js-table-action"
                        type="button"
                        data-action="edit"
                        data-id="${order.id}"
                        aria-label="View Order #${order.id}"
                        title="View & Edit Status"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Builds the HTML structure for a single trashed order row.
 * Note: Orders do not support soft-delete, but we provide this for consistency.
 *
 * @returns {string} The HTML string for the empty table row.
 */
export function buildTrashedOrderRow() {
    return '';
}
