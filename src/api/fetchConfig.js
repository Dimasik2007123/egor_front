const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const getBaseOptions = () => ({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

const addAuthHeader = (options = {}) => {
  const token = localStorage.getItem("accessToken");
  const baseOptions = getBaseOptions();

  const mergedOptions = {
    ...baseOptions,
    ...options,
    headers: {
      ...baseOptions.headers,
      ...options.headers,
    },
  };

  if (token) {
    mergedOptions.headers.Authorization = `Bearer ${token}`;
  }

  return mergedOptions;
};

async function fetchWithAuth(url, options = {}) {
  const fetchOptions = addAuthHeader(options);
  let response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

  if (
    response.status === 401 &&
    !options._retry &&
    !url.includes("/auth/refresh") &&
    !url.includes("/auth/login")
  ) {
    options._retry = true;

    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!refreshResponse.ok) {
        throw new Error("Refresh failed");
      }

      const refreshData = await refreshResponse.json();
      const newToken = refreshData.accessToken;

      localStorage.setItem("accessToken", newToken);

      const newOptions = addAuthHeader(options);
      response = await fetch(`${API_BASE_URL}${url}`, newOptions);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
      throw refreshError;
    }
  }

  if (!response.ok) {
    const error = new Error("HTTP error");
    error.status = response.status;
    error.response = response;
    throw error;
  }

  return response;
}

const api = {
  get: (url, options = {}) => fetchWithAuth(url, { ...options, method: "GET" }),
  post: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (url, options = {}) =>
    fetchWithAuth(url, { ...options, method: "DELETE" }),
  patch: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export default api;