import { ProductDTO } from "./product.dto.js";

export class CartItemDTO {
  constructor(data) {
    this.id = data.id || null;
    this.cart_id = data.cart_id || null;
    this.product_id = data.product_id || null;
    this.quantity = data.quantity || 1;
    this.options = data.options || {};

    if (data.product) {
      // The API returns `url` for images in cart item resource, 
      // but ProductDTO expects `img_path`. Let's normalize it here.
      const productData = { ...data.product };
      if (productData.images) {
        productData.images = productData.images.map(img => ({
          ...img,
          img_path: img.url || img.img_path
        }));
      }
      this.product = new ProductDTO(productData);
    } else {
      this.product = null;
    }
  }
}

export class CartDTO {
  constructor(data) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.items = (data.items || []).map(item => new CartItemDTO(item));
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;

    // Calculate totals for convenient usage in frontend
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subTotal = this.items.reduce((sum, item) => {
      const price = item.product ? item.product.currentPrice : 0;
      return sum + (price * item.quantity);
    }, 0);
  }
}
