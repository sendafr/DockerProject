import axios from 'axios';

// base URL should default to proxy path when not provided
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// export for use in components that still use plain axios
export { BASE_URL };

const api2 = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Attach Access Token to every request ────────────────────────────────────
api2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Auto-refresh Access Token on 401 ────────────────────────────────────────
api2.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only attempt a single retry per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // use the same instance so baseURL is applied automatically
        const { data } = await api2.post('/auth/token/refresh/', { refresh });

        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api2(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api2.post('/auth/register/', data),
  login:    (data) => api2.post('/auth/login/', data),
  logout:   (data) => api2.post('/auth/logout/', data),
  refresh:  (data) => api2.post('/auth/token/refresh/', data),
};

// ─── Profile Endpoints ────────────────────────────────────────────────────────
export const profileAPI = {
  get:            ()     => api2.get('/auth/profile/'),
  update:         (data) => api2.patch('/auth/profile/', data),
  delete:         ()     => api2.delete('/auth/profile/'),
  changePassword: (data) => api2.put('/auth/change-password/', data),
};

export default api2;