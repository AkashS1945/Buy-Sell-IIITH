import axios from "axios";
import { API_BASE_URL } from '../config/api';

// Register user
export const Registeruser = async (payload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/users/register`, payload);
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
            message: error.response?.data?.msg || error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }   
}

// Login user
export const Loginuser = async (payload) => {
    try {
        console.log('Loginuser called with payload:', { email: payload.email });
        const response = await axios.post(`${API_BASE_URL}/api/users/login`, payload);
        console.log('Login API response:', response);
        
        // Check for token in response
        if (response.data && response.data.token) {
            console.log('Token found in response');
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } else {
            console.log('No token in response:', response.data);
            return {
                success: false,
                message: 'No authentication token received',
                status: response.status
            };
        }
    } catch (error) {
        console.error('Login API error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.msg || error.response?.data?.message || 'Login failed',
            status: error.response?.status || 500
        };
    }
};

// Get current user
export const GetCurrentUser = async () => { 
    try {
        const token = localStorage.getItem('token');
        console.log('GetCurrentUser - Token exists:', !!token);
        
        if (!token) {
            console.log('No token found in GetCurrentUser');
            return {
                success: false,
                message: 'No token found'
            };
        }
        
        console.log("Making API call to get current user");
        
        const response = await axios.post(`${API_BASE_URL}/api/users/get-current-user`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("GetCurrentUser API response:", response);
        
        if (response.data && response.data.user) {
            console.log("User data found in response");
            return {
                success: true,
                data: response.data.user
            };
        } else {
            console.log("No user data in response:", response.data);
            return {
                success: false,
                message: 'No user data received'
            };
        }
    } catch (error) {
        console.error('GetCurrentUser error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('Token invalid, removing from localStorage');
            localStorage.removeItem('token');
        }
        
        return {
            success: false,
            message: error.response?.data?.error || error.response?.data?.message || error.message
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
        
        const response = await axios.put(`${API_BASE_URL}/api/users/update`, formData, {
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
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        
        return {
            success: false,
            message: error.response?.data?.msg || error.response?.data?.message || error.message,
        };
    }
}

// Logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
    return {
        success: true,
        message: 'User logged out successfully'
    };
}