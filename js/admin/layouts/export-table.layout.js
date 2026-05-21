import { escapeHtml } from "../../utils/table-layout.util.js";

/**
 * Builds the HTML structure for a single export row in the admin list.
 *
 * @param {ExportDTO} exportItem - The export DTO object.
 * @returns {string} The HTML string for the table row.
 */
export function buildExportRow(exportItem) {
  const status = (exportItem.status || "").toLowerCase();
  let statusLabel = "Pending";
  let statusStyle = "background: #fef3c7; color: #92400e;";

  if (status === "completed") {
    statusLabel = "Completed";
    statusStyle = "background: #dcfce3; color: #166534;";
  } else if (status === "failed") {
    statusLabel = "Failed";
    statusStyle = "background: #fee2e2; color: #991b1b;";
  } else if (status === "processing") {
    statusLabel = "Processing";
    statusStyle = "background: #dbeafe; color: #1e40af;";
  }

  // Action button based on status
  let actionBtnHtml = "";
  if (status === "completed") {
    actionBtnHtml = `
            <button
                class="action-btn js-table-action"
                type="button"
                data-action="download"
                data-id="${exportItem.id}"
                aria-label="Download export #${exportItem.id}"
                title="Download file"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="width: 14px; height: 14px;"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </button>
        `;
  } else if (status === "failed") {
    const errorMsg = "Export failed.";
    actionBtnHtml = `
            <button
                class="action-btn action-btn--danger js-table-action"
                type="button"
                data-action="show-error"
                data-id="${exportItem.id}"
                data-error="${escapeHtml(errorMsg)}"
                aria-label="View error for export #${exportItem.id}"
                title="View error details"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="width: 14px; height: 14px;"
                >
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            </button>
        `;
  } else {
    // Pending or processing
    actionBtnHtml = `
            <span style="
                font-size: 12px;
                color: #6b7280;
                font-style: italic;
            ">
                In Progress
            </span>
        `;
  }

  const fileDisplay = exportItem.filePath
    ? escapeHtml(exportItem.filePath.split("/").pop())
    : "N/A";

  const rawType = exportItem.type || "products";
  const typeDisplay = rawType.charAt(0).toUpperCase() + rawType.slice(1);

  const formatDisplay = (exportItem.format || "xlsx").toUpperCase();

  return `
        <tr>
            <td>
                <div class="data-table__meta">
                    <span>Export #${exportItem.id}</span>
                    <span class="data-table__email">
                        ${escapeHtml(exportItem.createdAt || "")}
                    </span>
                </div>
            </td>
            <td>
                <span style="font-weight: 500;">
                    ${escapeHtml(typeDisplay)}
                </span>
            </td>
            <td>
                <span>${escapeHtml(formatDisplay)}</span>
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
                <span style="
                    display: inline-block;
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 13px;
                " title="${escapeHtml(exportItem.filePath || "")}">
                    ${fileDisplay}
                </span>
            </td>
            <td>
                <div class="action-group">
                    ${actionBtnHtml}
                </div>
            </td>
        </tr>
    `;
}

/**
 * Builds the HTML structure for a single trashed export row.
 *
 * @returns {string} Empty string as exports cannot be trashed.
 */
export function buildTrashedExportRow() {
  return "";
}
