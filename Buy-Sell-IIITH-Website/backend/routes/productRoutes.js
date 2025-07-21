import express from 'express';
import Product from '../models/productModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add product
router.post('/add-product', authMiddleware, async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            age, 
            category, 
            sellerId,
            billAvailable,
            warrantyAvailable,
            boxAvailable,
            accessoriesAvailable
        } = req.body;

        // Validation
        if (!name || !description || !price || !age || !category || !sellerId) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be provided' 
            });
        }

        // Validate price
        if (isNaN(price) || price <= 0 || price > 999999) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price must be a valid number between 0.01 and 999,999' 
            });
        }

        // Validate age
        if (isNaN(age) || age < 0 || age > 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Age must be a valid number between 0 and 50' 
            });
        }

        // Validate category
        const validCategories = ['electronics', 'furniture', 'clothing', 'books', 'beauty', 'sports', 'grocery', 'others'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid category selected' 
            });
        }

        const newProduct = new Product({
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            age: parseInt(age),
            category,
            sellerId,
            billAvailable: billAvailable || false,
            warrantyAvailable: warrantyAvailable || false,
            boxAvailable: boxAvailable || false,
            accessoriesAvailable: accessoriesAvailable || false,
            status: 'available' // Ensure status is set
        });

        const savedProduct = await newProduct.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Product added successfully', 
            data: savedProduct 
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Get all products with optional filters
router.get('/get-products', async (req, res) => {
    try {
        console.log("Fetching all products...");
        
        const products = await Product.find({ 
            $or: [
                { status: 'available' },
                { status: { $exists: false } }
            ]
        })
        .populate('sellerId', 'firstName lastName email contactNumber')
        .sort({ createdAt: -1 });

        console.log(`Found ${products.length} products`);
        console.log("Sample product:", products[0]);

        // Return products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Get product by ID
router.get('/get-product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('sellerId', 'firstName lastName email contactNumber');

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(201).json({ 
            success: true, 
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Update product
router.put('/update-product/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData.sellerId;
        delete updateData.createdAt;

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { ...updateData, updatedAt: Date.now() }, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Product updated successfully', 
            data: updatedProduct 
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

// Delete product
router.delete('/delete-product/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(201).json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

export default router;