// use a relative path by default so proxies work in both dev and prod
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default API_BASE_URL;