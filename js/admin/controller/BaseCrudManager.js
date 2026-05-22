import { Modal } from "../components/modal.js";
import { DataTable } from "../components/table.js";
import { showToast } from "../components/toast.js";
import {
  serializeForm,
  showErrors,
  resetFormState,
} from "../../utils/admin-form.util.js";

export class BaseCrudManager {
  constructor(config) {
    this.config = config;
    this.modal = null;
    this.dataTable = null;
    this.currentMode = "create";
    this.currentId = null;
  }

  init(container) {
    if (!container) return;
    const { formId, entityName, layouts, columns, tableOptions } = this.config;

    // 1. Init Modal
    this.modal = new Modal({
      id: `${entityName.toLowerCase()}-modal`,
      title: `Create ${entityName}`,
      bodyHTML: layouts.formBody,
      footerHTML: layouts.formFooter,
      onClose: resetFormState,
    });

    // 2. Bind Form
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // 3. Init DataTable
    this.dataTable = new DataTable(container, {
      columns: columns,
      searchPlaceholder:
        tableOptions.searchPlaceholder || `Search ${entityName}...`,
      actionBtnText: tableOptions.actionBtnText || `+ Create ${entityName}`,
      exportBtnText: tableOptions.exportBtnText || null,
      fetchData: async (params) => {
        const result =
          params.tab === "trashed"
            ? await this.config.service.fetchTrashed(params)
            : await this.config.service.fetchAll(params);
        const items =
          result.items ||
          result.users ||
          result.data ||
          Object.values(result).find((val) => Array.isArray(val)) ||
          [];
        return { items: items, meta: result.meta, error: result.error };
      },
      renderRow: (item, tab) => {
        return tab === "trashed" ? layouts.trashedRow(item) : layouts.row(item);
      },
      onAction: (action, dataset) => this.handleTableAction(action, dataset),
    });
  }

  async handleTableAction(action, dataset) {
    const { entityName, service } = this.config;

    switch (action) {
      case "export":
        if (service.exportData) {
          const { error, message } = await service.exportData();
          if (error) {
            showToast({ message: error, type: "error" });
          } else {
            showToast({ message: message || "Exported successfully", type: "success" });
          }
        } else {
          showToast({ message: "Export not supported for this module", type: "warning" });
        }
        break;

      case "create":
        this.currentMode = "create";
        this.currentId = null;
        this.modal.setTitle(`Create ${entityName}`);
        if (this.config.onPrepareForm) this.config.onPrepareForm("create");
        this.modal.open();
        break;

      case "edit":
        this.currentMode = "edit";
        this.currentId = dataset.id;
        this.modal.setTitle(`Edit ${entityName}`);
        if (this.config.onPrepareForm) this.config.onPrepareForm("edit");

        let fillData = dataset ? { ...dataset } : {};
        const shouldFetch = !dataset.name
          || this.config.alwaysFetchOnEdit;
        if (this.currentId && shouldFetch) {
          try {
            const result = await service.fetchOne(this.currentId);
            if (result && result.error) {
              showToast({
                message: `Failed to load ${entityName}: ${result.error}`,
                type: "error",
              });
              return;
            }
            const item = (result && result.data) || {};
            Object.assign(fillData, item);
          } catch (error) {
            showToast({
              message: `Failed to load ${entityName}: ${error.message}`,
              type: "error",
            });
            return;
          }
        }

        // Gọi hàm fill form tùy chỉnh nếu có, nếu không dùng mặc định
        if (this.config.fillForm) this.config.fillForm(fillData);
        this.modal.open();
        break;

      case "delete":
        this.dataTable.showConfirm(
          `Move "${dataset.name}" to trash?`,
          async () => {
            const { error } = await service.trash(dataset.id);
            this.handleResult(error, "Moved to trash");
          },
        );
        break;

      case "restore":
        this.dataTable.showConfirm(`Restore "${dataset.name}"?`, async () => {
          const { error } = await service.recover(dataset.id);
          this.handleResult(error, "Restored successfully");
        });
        break;

      case "force-delete":
        this.dataTable.showConfirm(
          `Permanently delete "${dataset.name}"?`,
          async () => {
            const { error } = await service.destroy(dataset.id);
            this.handleResult(error, "Permanently deleted");
          },
        );
        break;
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const data = serializeForm(e.target);

    // Gọi hàm validate truyền từ config
    if (this.config.validator) {
      const errors = this.config.validator(data, this.currentMode);
      if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
      }
    }

    this.modal.setLoading(true);
    let result;

    if (this.currentMode === "create") {
      result = await this.config.service.create(data);
    } else {
      const updateData = this.config.formatUpdateData
        ? this.config.formatUpdateData(data)
        : data;

      console.log("Update data", updateData);
      result = await this.config.service.update(this.currentId, updateData);
    }

    this.modal.setLoading(
      false,
      "Saving…",
      this.currentMode === "create" ? "Submit" : "Save Changes",
    );

    if (result.error) {
      showToast({ message: result.error, type: "error" });
      return;
    }

    showToast({
      message: `${this.config.entityName} ${this.currentMode === "create" ? "created" : "updated"} successfully`,
      type: "success",
    });

    this.modal.close();
    this.dataTable.refresh();
  }

  handleResult(error, successMsg) {
    if (error) {
      showToast({ message: error, type: "error" });
    } else {
      showToast({ message: successMsg, type: "success" });
      this.dataTable.refresh();
    }
  }
}
