import axios from 'axios';


// Add a new product
export const addProduct = async (productData) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/products/add-product`, { productData }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// Get all products
export const getAllProducts = async (filters) => {
    try {
        console.log("Filters in get all products", filters);
        const response = await axios.post(`http://localhost:5000/api/products/get-all-products`,filters, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log("Response from get all products", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/products/delete/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};


//get product by id
export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/products/get-product-by-id/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};