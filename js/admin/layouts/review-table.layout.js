import { escapeHtml } from "../../utils/table-layout.util.js";

/**
 * Builds the HTML structure for a single review row in the admin list.
 *
 * @param {ReviewDTO} review - The review DTO object.
 * @returns {string} The HTML string for the table row.
 */
export function buildReviewRow(review) {
  const statusLabel = review.isApproved ? "Approved" : "Pending";
  const statusStyle = review.isApproved
    ? "background: #dcfce3; color: #166534;"
    : "background: #fef3c7; color: #920e66ff;";

  const renderStars = (rating) => {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += `<svg style="width:14px;height:14px;color:#facc15;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      } else {
        starsHtml += `<svg style="width:14px;height:14px;color:#e5e7eb;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      }
    }
    return `<div style="display:flex; gap:2px; align-items:center;">${starsHtml}</div>`;
  };

  return `
        <tr>
            <td>
                <div class="data-table__meta">
                    <span>Review #${review.id}</span>
                    <span class="data-table__email">
                        ${escapeHtml(review.date || "")}
                    </span>
                </div>
            </td>
            <td>
                <span style="font-weight: 500;">${escapeHtml(review.name)}</span>
            </td>
            <td>
                ${renderStars(review.rating)}
            </td>
            <td>
                <span style="
                    display: inline-block;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 13px;
                " title="${escapeHtml(review.comment)}">
                    ${escapeHtml(review.comment)}
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
                        data-id="${review.id}"
                        aria-label="View Review #${review.id}"
                        title="View & Edit Status"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                        class="action-btn action-btn--danger js-table-action"
                        type="button"
                        data-action="force-delete"
                        data-name="Review #${review.id}"
                        data-id="${review.id}"
                        aria-label="Delete Review #${review.id}"
                        title="Delete Review"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Builds the HTML structure for a single trashed review row.
 */
export function buildTrashedReviewRow(review) {
  return "";
}
