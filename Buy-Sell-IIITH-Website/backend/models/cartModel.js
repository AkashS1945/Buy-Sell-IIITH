import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
}, {
    timestamps: true
});

cartSchema.index({ userId: 1 });

cartSchema.methods.addProduct = function(productId) {
    if (!this.products.includes(productId)) {
        this.products.push(productId);
    }
    return this.save();
};

cartSchema.methods.removeProduct = function(productId) {
    this.products = this.products.filter(id => id.toString() !== productId.toString());
    return this.save();
};

cartSchema.methods.clearCart = function() {
    this.products = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;