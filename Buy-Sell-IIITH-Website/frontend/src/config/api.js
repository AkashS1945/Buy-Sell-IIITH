const config = {
  development: {
    API_BASE_URL: "http://localhost:5000"
  },
  production: {
    API_BASE_URL: "https://buy-sell-iiith-backend-luzb.onrender.com"
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
