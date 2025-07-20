import express from 'express';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// Get cart items with populated product details
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'products',
                populate: {
                    path: 'sellerId',
                    select: 'firstName lastName email contactNumber'
                }
            });
        
        if (!cart) {
            return res.status(200).json([]);
        }
        
        // Return just the product IDs (to match your frontend expectation)
        const productIds = cart.products.map(product => product._id.toString());
        res.status(200).json(productIds);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Get cart items with full product details (alternative endpoint)
router.get('/details/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'products',
                populate: {
                    path: 'sellerId',
                    select: 'firstName lastName email contactNumber'
                }
            });
        
        if (!cart) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(cart.products || []);
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        if (!userId || !productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Product ID are required' 
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Check if product is available
        if (product.status !== 'available') {
            return res.status(400).json({ 
                success: false, 
                message: 'Product is not available' 
            });
        }

        // Check if user is trying to add their own product
        if (product.sellerId.toString() === userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot add your own product to cart' 
            });
        }
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ 
                userId, 
                products: [productId] 
            });
        } else {
            if (!cart.products.includes(productId)) {
                cart.products.push(productId);
            } else {
                return res.status(200).json({ 
                    success: true, 
                    message: 'Product already in cart' 
                });
            }
        }
        
        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Product added to cart successfully' 
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        if (!userId || !productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Product ID are required' 
            });
        }
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }
        
        cart.products = cart.products.filter(id => id.toString() !== productId.toString());
        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Product removed from cart successfully' 
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Clear entire cart
router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }
        
        cart.products = [];
        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Cart cleared successfully' 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

export default router;