import axios from "axios";

export const placeOrder = async (buyerId, cartItems) => {
  try {
    const response = await axios.post("http://localhost:5000/api/orders/place-order", {
      buyerId: buyerId,
      cartItems: cartItems
    },{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserOrderHistory = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/orders/order-history/${userId}`, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSellerPendingOrders = async (sellerId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/orders/seller-pending-orders/${sellerId}`, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  });
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyAndCompleteOrder = async (orderId, otp) => {
  try {
    const response = await axios.post("http://localhost:5000/api/orders/verify-complete-order", {
      orderId: orderId,
      otp: otp
    },{
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  });
    return response;
  } catch (error) {
    throw error;
  }
};
