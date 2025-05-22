import axios from "axios";

export const Registeruser = async (payload) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/register', payload);
        return response;
    } catch (error) {
        return error.message;
    }   
}



export const Loginuser = async (payload) => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', payload);
    return response;
  } catch (error) {
    console.error('Error in Loginuser:', error.response?.data || error.message);
    return error.response || { status: 400, data: { msg: 'Login failed' } };
  }
};





export const GetCurrentUser = async () => { 
    try {
        // console.log("Token in getcurrentuser", localStorage.getItem('token'));
        const response = await axios.post('http://localhost:5000/api/users/get-current-user',null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        // console.log("Response from getcurrentuser", response.data);
        return response.data.user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return error.message;
    }
}

// Update user information
export const updateUser = async (formData) => {
    try {
        console.log("Token in updateUser", localStorage.getItem('token'));
        const response = await axios.put('http://localhost:5000/api/users/update', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log("Response from updateUser", response.data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: error.message,
        };
    }
}