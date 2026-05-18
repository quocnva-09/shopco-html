export class OrderDTO {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.status = data.status;
    this.totalAmount = data.totalAmount;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
    
    this.items = (data.items || []).map(item => new OrderItemDTO(item));
  }

  get formattedDate() {
    return this.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  get statusLabel() {
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  }
}

export class OrderItemDTO {
  constructor(data) {
    this.id = data.id;
    this.quantity = data.quantity;
    this.price = data.price;
    this.totalMoney = data.totalMoney;
    
    try {
      this.options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
    } catch (e) {
      this.options = {};
    }

    this.product = {
      id: data.product?.id,
      name: data.product?.name,
      imageUrl: data.product?.images?.[0]?.url || './assets/images/default-product.jpg',
    };
  }

  get formattedOptions() {
    if (!this.options) return '';
    return Object.entries(this.options)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join(', ');
  }
}
