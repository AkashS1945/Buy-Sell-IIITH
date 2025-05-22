import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Product from '../models/productModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add a new product
router.post('/add-product',authMiddleware , async (req, res) => {
    try {
        const { productData } = req.body;
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Error adding product', error: error.message });
    }
});

// Get all products
router.post('/get-all-products',authMiddleware, async (req, res) => {
    try {
        const { seller, categories = [] } = req.body;
        const filters = {};
        if (seller) {
            filters.sellerId = seller;
        }
        if (categories.length > 0) {
            filters.category = { $in: categories };
        }
        const products = await Product.find(filters)
            .populate('sellerId')
            .sort({ createdAt: -1 });
        res.status(201).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
    }
});

// Delete product by ID
router.delete('/delete/:id',authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
    }
});

// Get product by ID
router.get('/get-product-by-id/:id',authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('sellerId', 'firstName lastName email');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(201).json({ product });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
    }
});


export default router;