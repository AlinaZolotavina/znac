import { createRequest } from "./request";
export const BASE_URL = "https://api.znac.org";
// export const BASE_URL = "http://localhost:4000";

const request = createRequest(BASE_URL);

export const signup = (email, password) => {
  return request("/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const signin = (email, password) => {
  return request("/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const signout = () => {
  return request("/signout", {
    method: "DELETE",
  });
};

export const getContent = () => {
  return request("/profile", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const forgotPassword = (email) => {
  return request("/forgot-password", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = (
  newPassword,
  confirmPassword,
  resetPasswordLink,
) => {
  return request(`/reset-password/${resetPasswordLink}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword, confirmPassword }),
  });
};
