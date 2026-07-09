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
          break;

        case 403:
          error.type = "FORBIDDEN_ERROR";
          break;

        case 404:
          error.type = "NOT_FOUND_ERROR";
          break;

        default:
          error.type = "API_ERROR";
      }

      throw error;
    });
  };
};
