import { CategoryDTO } from "./category.dto.js";

export class ProductDTO {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || "Unknown Product";
    this.slug = data.slug || "";
    this.description = data.description || "";
    this.is_active = data.is_active ?? true;
    
    // Process category
    if (data.category) {
      this.category = new CategoryDTO(data.category);
    } else {
      this.category = null;
    }

    // Process dates
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
    
    // Product attributes
    this.sizes = data.sizes || [];
    this.colors = data.colors || [];

    // Process pricing
    // API provides `price` (original price) and `price_discount` (discounted price)
    this.originalPrice = data.price ? parseInt(data.price, 10) : 0;
    this.currentPrice = data.price_discount ? parseInt(data.price_discount, 10) : this.originalPrice;
    
    this.discountPercentage = 0;
    if (this.originalPrice > 0 && this.currentPrice < this.originalPrice) {
      this.discountPercentage = Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
    }

    // Process images
    this.images = data.images || [];
    
    // Find primary image or fallback to first image or default
    const primaryImgObj = this.images.find(img => img.is_primary) || this.images[0];
    this.primaryImage = primaryImgObj && primaryImgObj.img_path ? primaryImgObj.img_path : "assets/images/default.png";

    // Rating (temporarily defaulted to 5)
    this.rating = data.rating ?? 5;
  }
}
