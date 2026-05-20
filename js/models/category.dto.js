export class CategoryDTO {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || "Unknown Category";
    this.slug = data.slug || "";
    this.description = data.description || "";
    this.createdAt = data.created_at || null;
    this.updateAt = data.updated_at || null;
    this.deletedAt = data.deleted_at || null;
  }
}
