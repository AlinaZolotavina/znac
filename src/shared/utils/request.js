import {
  BAD_REQUEST_ERROR_MSG,
  FORBIDDEN_ERROR_MSG,
  INTERNAL_SERVER_ERROR_MSG,
  NOT_FOUND_ERROR_MSG,
  UNAUTHORIZED_ERROR_MSG,
} from "./messages";

export const createRequest = (baseUrl) => {
  return (url, options = {}) => {
    return fetch(`${baseUrl}${url}`, {
      credentials: "include",
      ...options,
    }).then(async (res) => {
      const data = await res.json().catch(() => null);

      if (res.ok) {
        return data;
      }

      const error = new Error(data?.message || `HTTP ${res.status}`);

      error.status = res.status;

      switch (res.status) {
        case 401:
          error.type = "AUTH_ERROR";
          error.message = error.message || UNAUTHORIZED_ERROR_MSG;
          break;

        case 403:
          error.type = "FORBIDDEN_ERROR";
          error.message = error.message || FORBIDDEN_ERROR_MSG;
          break;

        case 404:
          error.type = "NOT_FOUND_ERROR";
          error.message = error.message || NOT_FOUND_ERROR_MSG;
          break;

        case 400:
          error.type = "BAD_REQUEST_ERROR";
          error.message = error.message || BAD_REQUEST_ERROR_MSG;
          break;

        case 500:
          error.type = "API_ERROR";
          error.message = error.message || INTERNAL_SERVER_ERROR_MSG;
          break;

        default:
          error.type = "API_ERROR";
      }

      throw error;
    });
  };
};
