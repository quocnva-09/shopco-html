import { BaseCrudManager } from "../controller/BaseCrudManager.js";
import {
  buildReviewFormLayout,
  buildReviewFormFooter,
} from "../layouts/review-form.layout.js";
import {
  buildReviewRow,
  buildTrashedReviewRow,
} from "../layouts/review-table.layout.js";
import { ReviewService } from "../../services/review.service.js";

/**
 * Initializes the Review Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initReviewModule(container) {
  if (!container) return;

  const formId = "review-modal-form";

  const reviewCrud = new BaseCrudManager({
    entityName: "Review",
    formId: formId,

    service: {
      fetchAll: ReviewService.getAll,
      fetchTrashed: async () => ({ items: [], meta: null }),
      fetchOne: ReviewService.getById,
      create: async () => ({ error: "Creation not supported in admin" }),
      update: async (id, data) => {
        if (data.isApproved === "true" || data.isApproved === true) {
          return await ReviewService.approveReview(id);
        } else {
          return { error: "Cannot unapprove a review through the current API" };
        }
      },
      trash: ReviewService.deleteReview,
      recover: async () => ({ error: "Recovery not supported" }),
      destroy: ReviewService.deleteReview,
    },

    layouts: {
      formBody: buildReviewFormLayout(formId),
      formFooter: buildReviewFormFooter(
        formId,
        "modal-save-btn",
        "modal-cancel-btn",
      ),
      row: buildReviewRow,
      trashedRow: buildTrashedReviewRow,
    },

    columns: [
      { label: "Review", className: "" },
      { label: "User", className: "" },
      { label: "Rating", className: "" },
      { label: "Comment", className: "" },
      { label: "Status", className: "" },
      { label: "Actions", className: "data-table__actions-col" },
    ],

    tableOptions: {
      searchPlaceholder: "Search reviews...",
      actionBtnText: "",
    },

    formatUpdateData: (data) => {
      return { isApproved: data.isApproved };
    },

    validator: validateReviewForm,
    fillForm: fillReviewForm,
  });

  reviewCrud.init(container);

  // Hide the Create Review button since reviews cannot be created in admin.
  const createBtn = container.querySelector(".js-create-btn");
  if (createBtn) {
    createBtn.style.display = "none";
  }

  // Hide the tabs toolbar as reviews do not support soft-delete/trash.
  const tabsContainer = container.querySelector(".toolbar__tabs");
  if (tabsContainer) {
    tabsContainer.style.display = "none";
  }
}

/**
 * Validates the review form data.
 *
 * @returns {Object} An empty object as status dropdown is always valid.
 */
function validateReviewForm() {
  return {};
}

/**
 * Fills the review form modal with existing review details and status.
 *
 * @param {Object} review - The review data.
 */
function fillReviewForm(review) {
  const idEl = document.getElementById("field-review-id");
  const dateEl = document.getElementById("field-review-date");
  const userEl = document.getElementById("field-review-user");
  const productEl = document.getElementById("field-review-product");
  const commentEl = document.getElementById("field-review-comment");
  const statusEl = document.getElementById("field-is-approved");
  const ratingContainer = document.getElementById("field-review-rating");

  if (idEl) idEl.value = review.id ? `#${review.id}` : "";
  if (dateEl) dateEl.value = review.date || "";
  if (userEl) userEl.value = review.name || "Anonymous";
  if (productEl) productEl.value = review.productId || "";
  if (commentEl) commentEl.value = review.comment || "";
  if (statusEl) statusEl.value = review.isApproved ? "true" : "false";

  if (ratingContainer) {
    const rating = review.rating || 0;
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += `<svg style="width:20px;height:20px;color:#facc15;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      } else {
        starsHtml += `<svg style="width:20px;height:20px;color:#e5e7eb;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      }
    }
    ratingContainer.innerHTML = starsHtml;
  }
}
