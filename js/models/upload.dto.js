/**
 * Data Transfer Object for image uploads.
 */
export class UploadDTO {
  /**
   * Create an UploadDTO.
   *
   * @param {Object} data - The raw upload data from backend.
   */
  constructor(data) {
    this.imgPath = data.img_path || "";
    this.imageUrl = data.image_url || "";
  }
}
