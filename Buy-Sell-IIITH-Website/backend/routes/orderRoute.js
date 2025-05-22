import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// For Generating OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Place order from cart
router.post('/place-order',authMiddleware, async (req, res) => {
  try {
    const { buyerId, cartItems } = req.body;
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    
    const orders = await Promise.all(cartItems.map(async (item) => {
      const order = new Order({
        transactionId: crypto.randomUUID(),
        buyerId,
        sellerId: item.sellerId,
        productId: item._id,
        amount: item.price,
        hashedOTP,
        status: 'pending'
      });
      await order.save();
      return { ...order.toObject(), plainOTP: otp };
    }));

    await User.updateOne(
      { _id: buyerId },
      { $set: { itemsInCart: [] } }
    );

    res.status(200).json({
      success: true,
      orders: orders,
      otp: otp 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get pending orders for seller
router.get('/seller-pending-orders/:sellerId',authMiddleware, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ 
      sellerId, 
      status: 'pending' 
    }).populate('buyerId productId');
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify OTP and complete order
router.post('/verify-complete-order',authMiddleware, async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await Order.findById(orderId);
    
    const isValid = await bcrypt.compare(otp, order.hashedOTP);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    order.status = 'completed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get order history for user
router.get('/order-history/:id',authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const boughtItems = await Order.find({ 
      buyerId: userId 
    }).populate('sellerId productId');
    
    const soldItems = await Order.find({ 
      sellerId: userId 
    }).populate('buyerId productId');
    
    res.status(200).json({
      success: true,
      boughtItems,
      soldItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
