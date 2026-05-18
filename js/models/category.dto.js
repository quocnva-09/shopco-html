export class CategoryDTO {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || "Unknown Category";
    this.slug = data.slug || "";
    this.description = data.description || "";
  }
}
