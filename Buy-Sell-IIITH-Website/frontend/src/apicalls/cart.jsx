import axios from "axios";
import { API_BASE_URL } from '../config/api';

export const addToCart = async (userId, productId) => {
  return await axios.post(`${API_BASE_URL}/api/cart/add`, { userId, productId }, {  
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const getCartItems = async (userId) => {
  return await axios.get(`${API_BASE_URL}/api/cart/${userId}`, { 
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const removeFromCart = async (userId, productId) => {
  return await axios.post(`${API_BASE_URL}/api/cart/remove`, { userId, productId }, {  
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const clearCart = async (userId) => {
  return await axios.delete(`${API_BASE_URL}/api/cart/clear/${userId}`, {  
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};