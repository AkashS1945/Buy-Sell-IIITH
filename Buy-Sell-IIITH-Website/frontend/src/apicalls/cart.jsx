import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const addToCart = async (userId, productId) => {
  return await axios.post(`${BASE_URL}/api/cart/add`, { userId, productId }, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const getCartItems = async (userId) => {
  return await axios.get(`${BASE_URL}/api/cart/${userId}`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const removeFromCart = async (userId, productId) => {
  return await axios.post(`${BASE_URL}/api/cart/remove`, { userId, productId }, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const clearCart = async (userId) => {
  return await axios.delete(`${BASE_URL}/api/cart/clear/${userId}`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};