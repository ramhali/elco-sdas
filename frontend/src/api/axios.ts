import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: BASE_URL,
});

export const authApi = axios.create({
  baseURL: BASE_URL,
});


// ==================================================
// REQUEST INTERCEPTOR
// ==================================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ==================================================
// TOKEN REFRESH
// ==================================================

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};


// ==================================================
// RESPONSE INTERCEPTOR
// ==================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Another request is already refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      isRefreshing = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

        // No refresh token → user needs to log in
      if (!refreshToken) {
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        // IMPORTANT:
        // Use authApi, NOT api
        const response = await authApi.post(
          "/api/users/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const { access } = response.data;

        localStorage.setItem(
          "accessToken",
          access
        );

        processQueue(null, access);

        // Retry original request with new token
        originalRequest.headers.Authorization =
          `Bearer ${access}`;

        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        window.location.href = "/signin";

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);