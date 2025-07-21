import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api/users';

// Register user
export const Registeruser = async (payload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, payload);
        console.log('Registration successful:', response.data);
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.msg || error.message,
            status: error.response?.status || 500
        };
    }   
}

// Login user
export const Loginuser = async (payload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, payload);
        console.log('Login successful:', response.data);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.msg || error.message,
            status: error.response?.status || 500
        };
    }
};

// Get current user
export const GetCurrentUser = async () => { 
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No token found'
            };
        }
        
        console.log("Token in getcurrentuser", token);
        
        const response = await axios.post(`${API_BASE_URL}/get-current-user`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("Response from getcurrentuser", response.data);
        return {
            success: true,
            data: response.data.user
        };
    } catch (error) {
        console.error('Error fetching current user:', error.response?.data || error.message);
        
        // If token invalid-removing from localStorage
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        
        return {
            success: false,
            message: error.response?.data?.error || error.message
        };
    }
}

// Update user information
export const updateUser = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        
        console.log("Token in updateUser", token);
        console.log("Form data:", formData);
        
        const response = await axios.put(`${API_BASE_URL}/update`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("Response from updateUser", response.data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Error updating user:', error.response?.data || error.message);
        
        // If token invalid-removing from localStorage
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        
        return {
            success: false,
            message: error.response?.data?.msg || error.message,
        };
    }
}

// Logout user (helper function)
export const logoutUser = () => {
    localStorage.removeItem('token');
    return {
        success: true,
        message: 'User logged out successfully'
    };
}