import { BaseCrudManager } from "../controller/BaseCrudManager.js";
import {
  buildProductFormLayout,
  buildProductFormFooter,
} from "../layouts/product-form.layout.js";
import {
  buildProductRow,
  buildTrashedProductRow,
} from "../layouts/product-table.layout.js";
import { ProductService } from "../../services/product.service.js";
import { CategoryService } from "../../services/category.service.js";
import { ExportService } from "../../services/export.service.js";

/**
 * Initializes the Product Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initProductModule(container) {
  if (!container) return;

  const formId = "product-modal-form";

  const productCrud = new BaseCrudManager({
    entityName: "Product",
    formId: formId,

    service: {
      fetchAll: ProductService.getAdminProducts,
      fetchTrashed: ProductService.getTrashedProducts,
      fetchOne: ProductService.getProductById,
      create: ProductService.createProduct,
      update: ProductService.updateProduct,
      trash: ProductService.deleteProduct,
      recover: ProductService.restoreProduct,
      destroy: ProductService.forceDeleteProduct,
      exportData: ExportService.exportProducts,
    },

    layouts: {
      formBody: buildProductFormLayout(formId),
      formFooter: buildProductFormFooter(
        formId,
        "modal-save-btn",
        "modal-cancel-btn",
      ),
      row: buildProductRow,
      trashedRow: buildTrashedProductRow,
    },

    columns: [
      { label: "Product", className: "" },
      { label: "Price", className: "" },
      { label: "Category", className: "" },
      { label: "Status", className: "" },
      { label: "Actions", className: "data-table__actions-col" },
    ],

    tableOptions: {
      searchPlaceholder: "Search products...",
      actionBtnText: "+ Create Product",
      exportBtnText: "Export",
    },

    formatUpdateData: (data) => {
      const {
        name,
        slug,
        category_id,
        price,
        price_discount,
        description,
        is_active,
      } = data;
      return {
        name,
        slug,
        category_id,
        price,
        price_discount,
        description,
        is_active,
      };
    },

    validator: validateProductForm,
    fillForm: fillProductForm,
  });

  productCrud.init(container);

  // Preload categories into select dropdown
  loadCategoriesIntoSelect();
}

/**
 * Preloads categories from the database and inserts them into the select.
 *
 * @returns {Promise<void>}
 */
async function loadCategoriesIntoSelect() {
  const select = document.getElementById("field-category");
  if (!select) return;

  const { success, categories } = await CategoryService.getAdminCategories({
    limit: 100,
  });

  if (success && categories) {
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  }
}

/**
 * Validates the product form data.
 *
 * @param {Object} data - The form data to validate.
 * @returns {Object} An object containing validation error messages.
 */
function validateProductForm(data) {
  const errors = {};

  // Map boolean value for is_active from checkbox state directly
  const isActiveEl = document.querySelector('[name="is_active"]');
  data.is_active = isActiveEl ? isActiveEl.checked : false;

  if (!data.name) {
    errors.name = "Product name is required.";
  }

  if (!data.slug) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = "Slug can only contain letters, numbers, and hyphens.";
  }

  if (!data.price) {
    errors.price = "Original price is required.";
  } else if (isNaN(data.price) || Number(data.price) < 0) {
    errors.price = "Price must be a positive number.";
  }

  return errors;
}

/**
 * Fills the product form with existing product data for editing.
 *
 * @param {Object} product - The product data.
 */
function fillProductForm(product) {
  const categoryId =
    product.category_id || (product.category ? product.category.id : "");

  // Ensure status is correctly converted to boolean
  const isActive = product.is_active === "true" || product.is_active === true;

  const fieldMap = {
    name: product.name || "",
    slug: product.slug || "",
    category_id: categoryId || "",
    price: product.price || "",
    price_discount: product.price_discount || "",
    description: product.description || "",
  };

  Object.entries(fieldMap).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });

  const isActiveEl = document.querySelector('[name="is_active"]');
  if (isActiveEl) {
    isActiveEl.checked = isActive;
  }
}
