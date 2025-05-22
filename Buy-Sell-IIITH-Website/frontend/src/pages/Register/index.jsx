import React, { useState } from 'react';
import { Registeruser } from '../../apicalls/users';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { useEffect } from 'react';


function Register() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', values)

      if (response.status == 400) 
      {
        console.log("User already exists");
      }
      if (response.status == 201) {
          console.log("User registered successfully");
          navigate('/login');
        }

      }
    catch (error) {
      console.error('There was an error registering the user!', error); 
    }
  };

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.firstName || !values.lastName) {
      newErrors.name = "First Name and Last Name are required.";
    }
    if (!values.email || !/^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/.test(values.email)) {
      newErrors.email = "Valid @iiit.ac.in email is required.";
    }
    if (!values.age || isNaN(values.age) || values.age <= 0) {
      newErrors.age = "Please enter a valid age.";
    }
    if (!values.password || values.password.length < 1) {
      newErrors.password = "Password must be at least 2  characters long.";
    }
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());

    if (validateForm(values)) {
      onFinish(values);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          BUY/SELL IIITH
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>

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
            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="number"
                name="contactNumber"
                placeholder="Enter your Phone Number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber}</p>}
            </div>
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Register
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
