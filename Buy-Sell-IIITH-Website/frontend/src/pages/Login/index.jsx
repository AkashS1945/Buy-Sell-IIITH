import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { Loginuser } from '../../apicalls/users';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.email || !/^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/.test(values.email)) {
      newErrors.email = "Valid @iiit.ac.in email is required.";
    }

    if (!values.password || values.password.length < 1) {
      newErrors.password = "Password must be at least 2 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', values);
      
      // const response =  await Loginuser(values);
      console.log(response.data);
      if (response.status == 201 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile');
      }
      if(response.status == 400){
        console.log("Invalid Credentials");
      }
    } catch (error) {
      console.error('There was an error logging in the user!', error);
      console.log("Error message:", error.response.data.msg);
      setErrors({ login: 'Invalid email or password' });
      navigate('/register');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());
    console.log(values)
    if (validateForm(values)) {
      onFinish(values);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          BUY/SELL IIITH
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
            {/* Submit Button */}
            <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  Login
                </button>
              </div>
            {errors.login && <p className="text-red-500 text-xs mt-1">{errors.login}</p>}
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/register" className="text-indigo-500 hover:underline">
                Register
              </a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Login;