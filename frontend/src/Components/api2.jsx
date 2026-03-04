import axios from 'axios';

const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');

        if (!refresh) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          { refresh }
        );

        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);

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
  register: (data) => api2.post('api/auth/register/', data),
  login:    (data) => api2.post('api/auth/login/', data),
  logout:   (data) => api2.post('api/auth/logout/', data),
  refresh:  (data) => api2.post('api/auth/token/refresh/', data),
};

// ─── Profile Endpoints ────────────────────────────────────────────────────────
export const profileAPI = {
  get:            ()     => api2.get('api/auth/profile/'),
  update:         (data) => api2.patch('api/auth/profile/', data),
  delete:         ()     => api2.delete('api/auth/profile/'),
  changePassword: (data) => api2.put('api/auth/change-password/', data),
};

export default api2;