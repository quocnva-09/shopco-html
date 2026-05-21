export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const getNoAcceptHeader = () => {
  return {
    "Content-Type": "application/json",
  };
};

export function getUploadHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}
