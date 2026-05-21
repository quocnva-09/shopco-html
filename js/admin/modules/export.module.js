import { BaseCrudManager } from "../controller/BaseCrudManager.js";
import {
  buildExportRow,
  buildTrashedExportRow,
} from "../layouts/export-table.layout.js";
import { ExportService } from "../../services/export.service.js";
import { showToast } from "../components/toast.js";

/**
 * Initializes the Export Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initExportModule(container) {
  if (!container) return;

  const exportCrud = new BaseCrudManager({
    entityName: "Export",
    formId: "export-modal-form",

    service: {
      fetchAll: ExportService.getAll,
      fetchTrashed: async () => ({ items: [], meta: null }),
      fetchOne: ExportService.getById,
      create: async () => ({ error: "Not supported" }),
      update: async () => ({ error: "Not supported" }),
      trash: async () => ({ error: "Not supported" }),
      recover: async () => ({ error: "Not supported" }),
      destroy: async () => ({ error: "Not supported" }),
    },

    layouts: {
      formBody: "<div></div>",
      formFooter: "<div></div>",
      row: buildExportRow,
      trashedRow: buildTrashedExportRow,
    },

    columns: [
      { label: "Export", className: "" },
      { label: "Type", className: "" },
      { label: "Format", className: "" },
      { label: "Status", className: "" },
      { label: "File Name", className: "" },
      { label: "Actions", className: "data-table__actions-col" },
    ],

    tableOptions: {
      searchPlaceholder: "Search export history...",
      actionBtnText: "",
    },
  });

  // Override handleTableAction to implement custom action logic
  exportCrud.handleTableAction = async function (action, dataset) {
    if (action === "download") {
      try {
        showToast({
          message: "Retrieving secure download link...",
          type: "info",
        });

        const result = await ExportService.getDownloadUrl(dataset.id);

        if (result && result.success && result.downloadUrl) {
          const a = document.createElement("a");
          a.href = result.downloadUrl;
          a.style.display = "none";
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          showToast({
            message: "Download started.",
            type: "success",
          });
        } else {
          showToast({
            message: result?.error || "Failed to retrieve download link.",
            type: "error",
          });
        }
      } catch (error) {
        showToast({
          message: error.message || "An error occurred during download.",
          type: "error",
        });
      }
    } else if (action === "show-error") {
      showToast({
        message: dataset.error || "Export failed with an unknown error.",
        type: "error",
      });
    } else {
      // Fallback for default actions
      await BaseCrudManager.prototype.handleTableAction.call(
        this,
        action,
        dataset
      );
    }
  };

  exportCrud.init(container);

  // Hide the Create button since export jobs are triggered from products
  const createBtn = container.querySelector(".js-create-btn");
  if (createBtn) {
    createBtn.style.display = "none";
  }

  // Hide the tabs toolbar as export history does not support soft-delete
  const tabsContainer = container.querySelector(".toolbar__tabs");
  if (tabsContainer) {
    tabsContainer.style.display = "none";
  }
}
