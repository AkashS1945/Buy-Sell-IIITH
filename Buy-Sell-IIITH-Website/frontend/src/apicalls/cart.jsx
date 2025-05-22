import axios from "axios";

export const addToCart = async (userId, productId) => {
  return await axios.post("http://localhost:5000/api/cart/add", { userId, productId }, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const getCartItems = async (userId) => {
  return await axios.get(`http://localhost:5000/api/cart/${userId}`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
};

export const removeFromCart = async (userId, productId) => {
  return await axios.post("http://localhost:5000/api/cart/remove", { userId, productId }, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
};


