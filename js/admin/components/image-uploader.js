import { showToast } from "./toast.js";

/**
 * A reusable class for handling image uploads,
 * preview rendering, and removal in admin forms.
 */
export class ImageUploader {
    /**
     * @param {Object} config
     * @param {string} config.containerSelector - CSS selector for the preview container
     * @param {string} config.fileInputId - ID of the file input element
     * @param {string} config.hiddenInputId - ID of the hidden input for JSON string
     * @param {Function} config.uploadFn - Function that takes a File and returns {success, data: {imgPath, imageUrl}, error}
     */
    constructor(config) {
        this.config = config;
        this.currentUploadedImages = [];
        this.handleImageUploadChange = this.handleImageUploadChange.bind(this);
        this.handlePreviewContainerClick = this.handlePreviewContainerClick.bind(this);
    }

    /**
     * Resets state and sets up event listeners.
     */
    init() {
        this.reset();
        this.setupEvents();
    }

    /**
     * Clears the image state and updates preview.
     */
    reset() {
        this.currentUploadedImages = [];
        this.updateImagesPreview();
    }

    /**
     * Sets the images from existing data and updates preview.
     * @param {Array} images - Array of image objects from API
     */
    setImages(images) {
        this.currentUploadedImages = images.map((img) => ({
            path: img.img_path || img.path || "",
            url: img.image_url || img.url || img.img_path || "",
        }));
        this.updateImagesPreview();
    }

    /**
     * Binds file input change and container click events.
     */
    setupEvents() {
        const fileInput = document.getElementById(this.config.fileInputId);
        if (fileInput) {
            const fresh = fileInput.cloneNode(true);
            fileInput.parentNode.replaceChild(fresh, fileInput);
            fresh.addEventListener("change", this.handleImageUploadChange);
        }

        const container = document.querySelector(this.config.containerSelector);
        if (container) {
            container.addEventListener("click", this.handlePreviewContainerClick);
        }
    }

    /**
     * Handles file input change, uploads sequentially, and updates preview.
     */
    async handleImageUploadChange(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        for (const file of files) {
            const result = await this.config.uploadFn(file);
            if (result.success && result.data) {
                this.currentUploadedImages.push({
                    path: result.data.imgPath,
                    url: result.data.imageUrl,
                });
                this.updateImagesPreview();
            } else {
                showToast({
                    message: result.error || "Failed to upload image",
                    type: "error",
                });
            }
        }

        // Reset the input so re-selecting the same file works
        e.target.value = "";
    }

    /**
     * Handles remove button clicks inside the container.
     */
    handlePreviewContainerClick(e) {
        const removeBtn = e.target.closest(".js-remove-image");
        if (!removeBtn) return;

        const index = parseInt(removeBtn.dataset.index, 10);
        if (isNaN(index)) return;

        this.currentUploadedImages.splice(index, 1);
        this.updateImagesPreview();
    }

    /**
     * Builds the HTML for a single image preview card.
     */
    buildImagePreviewCard(img, index) {
        const src = img.url || img.path;
        return `
            <div class="admin-form__image-preview">
                <img
                    class="admin-form__image-preview-img"
                    src="${src}"
                    alt="Uploaded image ${index + 1}"
                    loading="lazy"
                >
                <button
                    type="button"
                    class="admin-form__image-preview-remove js-remove-image"
                    data-index="${index}"
                    aria-label="Remove image"
                >&times;</button>
            </div>`;
    }

    /**
     * Extracts the relative path from a full URL, or returns it if already relative.
     */
    extractRelativePath(fullPath) {
        if (!fullPath) return "";
        try {
            const url = new URL(fullPath);
            return url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
        } catch (e) {
            return fullPath; // Already relative
        }
    }

    /**
     * Rebuilds the preview container and updates the hidden input.
     */
    updateImagesPreview() {
        const container = document.querySelector(this.config.containerSelector);
        if (!container) return;

        const thumbsHtml = this.currentUploadedImages
            .map((img, i) => this.buildImagePreviewCard(img, i))
            .join("");

        const triggerHtml = `
            <div
                class="admin-form__image-trigger js-upload-trigger-card"
                onclick="document.getElementById('${this.config.fileInputId}').click();"
            >
                <svg
                    class="admin-form__image-trigger-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span class="admin-form__image-trigger-label">
                    Add Image
                </span>
            </div>`;

        container.innerHTML = thumbsHtml + triggerHtml;

        const hiddenInput = document.getElementById(this.config.hiddenInputId);
        if (hiddenInput) {
            const paths = this.currentUploadedImages.map((img) => this.extractRelativePath(img.path));
            hiddenInput.value = JSON.stringify(paths);
        }
    }
}
