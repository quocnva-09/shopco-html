import { renderRating } from "./product-card.js";

/**
 * Generates HTML for a single review card.
 * @param {import("../models/review.dto.js").ReviewDTO} review
 * @returns {string}
 */
export function generateReviewCardHTML(review) {
  return `
    <div class="review-card">
      <div class="review-card__header">
        <div class="rating-row">
            <div class="rating">${renderRating(review.rating)}</div>
        </div>
        <button class="review-card__menu"></button>
      </div>
      <div class="review-card__name-wrapper">
        <div class="review-card__name">
          <span>${review.name}</span>
          <span class="verified-icon"></span>
        </div>
        <div class="tooltip tooltip--review-card">
          <span>${review.name}</span>
          <span class="verified-icon"></span>
        </div>
      </div>
      <div class="review-card__comment-wrapper">
        <p class="review-card__comment">${review.comment}</p>
        <div class="tooltip tooltip--comment">${review.comment}</div>
      </div>
      <time class="review-card__date">Posted ${review.date}</time>
    </div>
  `;
}
