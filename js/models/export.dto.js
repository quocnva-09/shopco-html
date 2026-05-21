export class ExportDTO {
  constructor(data) {
    this.id = data.id || null;
    this.type = data.type || null;
    this.format = data.format || "";
    this.status = data.status || "";
    this.filePath = data.file_path || "";
    this.errorMessage = data.error_message || "";
    this.createdAt = data.created_at || "";

    // Map backend created_at to frontend date string
    if (data.created_at) {
      const date = new Date(data.created_at);
      this.createdAt = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      this.createdAt = "";
    }
  }
}

