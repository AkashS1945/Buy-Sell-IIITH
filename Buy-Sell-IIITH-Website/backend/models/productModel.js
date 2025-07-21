import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        required: true,
        min: 0.01,
        max: 999999
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 50
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'furniture', 'clothing', 'books', 'beauty', 'sports', 'grocery', 'others']
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    billAvailable: {
        type: Boolean,
        default: false
    },
    warrantyAvailable: {
        type: Boolean,
        default: false
    },
    boxAvailable: {
        type: Boolean,
        default: false
    },
    accessoriesAvailable: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'removed'],
        default: 'available'
    }
}, {
    timestamps: true
});

productSchema.index({ category: 1, status: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;