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
import { UploadService } from "../../services/upload.service.js";
import { ImageUploader } from "../components/image-uploader.js";

let imageUploaderInstance = null;

/**
 * Initializes the Product Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initProductModule(container) {
    if (!container) return;

    const formId = "product-modal-form";

    imageUploaderInstance = new ImageUploader({
        containerSelector: ".js-images-preview-container",
        fileInputId: "field-image-upload",
        hiddenInputId: "field-images-json",
        uploadFn: UploadService.uploadProductImage,
    });

    const productCrud = new BaseCrudManager({
        entityName: "Product",
        formId: formId,
        alwaysFetchOnEdit: true,

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
            {
                label: "Actions",
                className: "data-table__actions-col",
            },
        ],

        tableOptions: {
            searchPlaceholder: "Search products...",
            actionBtnText: "+ Create Product",
            exportBtnText: "Export",
        },

        onPrepareForm: () => {
            imageUploaderInstance.init();
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
                images,
            } = data;
            return {
                name,
                slug,
                category_id,
                price,
                price_discount,
                description,
                is_active,
                images,
            };
        },

        validator: validateProductForm,
        fillForm: fillProductForm,
    });

    productCrud.init(container);

    // Preload categories into select dropdown
    loadCategoriesIntoSelect();
}



// ── Category preload ─────────────────────────────────

/**
 * Preloads categories from the database and inserts
 * them into the select.
 *
 * @returns {Promise<void>}
 */
async function loadCategoriesIntoSelect() {
    const select = document.getElementById(
        "field-category",
    );
    if (!select) return;

    const { success, categories } =
        await CategoryService.getAdminCategories({
            limit: 100,
        });

    if (success && categories) {
        categories.forEach((cat) => {
            const option = document.createElement(
                "option",
            );
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }
}

// ── Form validation ──────────────────────────────────

/**
 * Validates the product form data.
 *
 * @param {Object} data - The form data to validate.
 * @returns {Object} An object with validation errors.
 */
function validateProductForm(data) {
    const errors = {};

    // Map boolean from checkbox state
    const isActiveEl = document.querySelector(
        '[name="is_active"]',
    );
    data.is_active = isActiveEl
        ? isActiveEl.checked
        : false;

    // Parse images from the hidden input
    try {
        data.images = JSON.parse(
            data.images || "[]",
        );
    } catch {
        data.images = [];
    }

    if (!data.name) {
        errors.name = "Product name is required.";
    }

    if (!data.slug) {
        errors.slug = "Slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.slug =
            "Slug can only contain "
            + "letters, numbers, and hyphens.";
    }

    if (!data.price) {
        errors.price = "Original price is required.";
    } else if (
        isNaN(data.price) || Number(data.price) < 0
    ) {
        errors.price =
            "Price must be a positive number.";
    }

    return errors;
}

// ── Fill form for editing ────────────────────────────

/**
 * Fills the product form with existing product data
 * for editing. Also renders existing images into the
 * preview container.
 *
 * @param {Object} product - The product data (DTO).
 */
function fillProductForm(product) {
    const categoryId = product.category_id
        || (product.category
            ? product.category.id
            : "");

    // Ensure status is correctly converted to boolean
    const isActive = product.is_active === "true"
        || product.is_active === true;

    const fieldMap = {
        name: product.name || "",
        slug: product.slug || "",
        category_id: categoryId || "",
        price: product.price
            || product.originalPrice || "",
        price_discount: product.price_discount
            || product.currentPrice || "",
        description: product.description || "",
    };

    Object.entries(fieldMap).forEach(
        ([name, value]) => {
            const el = document.querySelector(
                `[name="${name}"]`,
            );
            if (el) el.value = value;
        },
    );

    const isActiveEl = document.querySelector(
        '[name="is_active"]',
    );
    if (isActiveEl) {
        isActiveEl.checked = isActive;
    }

    // ── Render existing product images ───────────
    const images = product.images || [];
    imageUploaderInstance.setImages(images);
}
