export class ReviewDTO {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.user_id || null;
    this.name = data.user_name || "Anonymous User";
    this.productId = data.product_id || null;
    this.orderItemId = data.order_item_id || null;
    this.rating = data.rating || 0;
    this.comment = data.comment || "";
    this.isApproved = data.is_approved || false;
    
    // Map backend created_at to frontend date string
    if (data.created_at) {
      const date = new Date(data.created_at);
      this.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      this.date = "";
    }
  }
}
