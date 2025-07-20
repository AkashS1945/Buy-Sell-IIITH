import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // Each user has one cart
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

// Index for faster queries
cartSchema.index({ userId: 1 });

// Method to add product to cart
cartSchema.methods.addProduct = function(productId) {
    if (!this.products.includes(productId)) {
        this.products.push(productId);
    }
    return this.save();
};

// Method to remove product from cart
cartSchema.methods.removeProduct = function(productId) {
    this.products = this.products.filter(id => id.toString() !== productId.toString());
    return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
    this.products = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;