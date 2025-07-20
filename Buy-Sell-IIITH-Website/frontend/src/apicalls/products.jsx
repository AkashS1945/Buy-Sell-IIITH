import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api/products';

export const addProduct = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-product`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async (filters = {}) => {
  try {
    console.log("Making API call to get all products...");
    
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await axios.get(`${API_BASE_URL}/get-products?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log("Raw API response:", response);
    console.log("Response data:", response.data);
    console.log("Is array?", Array.isArray(response.data));
    
    // Backend returns products directly in response.data
    return response.data; // Return the products array directly
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log("Fetching product by ID:", id);
    const response = await axios.get(`${API_BASE_URL}/get-product/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("Product by ID response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    throw error;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-product/${id}`, payload, {
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
    const response = await axios.delete(`${API_BASE_URL}/delete-product/${id}`, {
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
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};