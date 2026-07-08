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
      error.type =
        res.status === 401 || res.status === 404 ? "AUTH_ERROR" : "API_ERROR";

      throw error;
    });
  };
};
