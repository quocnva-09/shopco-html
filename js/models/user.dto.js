// models/user.dto.js
export class UserDTO {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || "Anonymous user";
    this.email = data.email || "No email";
    this.phone = data.phone || "No phone";
    this.bio = data.bio || "No bio";
    this.address = data.address || "No address";
    this.avatar = data.profile_image || "https://shopco-s3.s3.ap-southeast-1.amazonaws.com/fallback/avatar.png";
    this.role = data.role || "user";
    this.createdAt = data.created_at || null;
  }
}
