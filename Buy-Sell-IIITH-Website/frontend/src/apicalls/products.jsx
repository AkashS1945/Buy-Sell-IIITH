import axios from "axios";

import { API_BASE_URL } from '../config/api';


export const addProduct = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/products/add-product`, payload, { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/get-products`); 
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log("Fetching product by ID:", id);
    const response = await axios.get(`${API_BASE_URL}/api/products/get-product/${id}`);
    console.log("Product by ID response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    throw error;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/products/update-product/${id}`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/products/delete-product/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};