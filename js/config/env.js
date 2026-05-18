export const ENV = {
  IS_PRODUCTION: false,
  API_LOCAL: "http://localhost:8000/api",
  API_PRODUCTION: "https://api.quocnva09.me/api",

  get BASE_URL() {
    return this.IS_PRODUCTION ? this.API_PRODUCTION : this.API_LOCAL;
  },
};
