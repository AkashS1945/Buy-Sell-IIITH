import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useUser } from "../../usercontext/UserContext";
import { updateUser } from "../../apicalls/users";

function Profile() {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        age: user.age || "",
        contactNumber: user.contactNumber || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        contactNumber: formData.contactNumber,
      };

      if (formData.password && formData.password.trim() !== "") {
        updatePayload.password = formData.password;
      }

      const response = await updateUser(updatePayload);
      if (response.success) {
        message.success("Profile updated successfully!");
        setUser(response.data.user);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        message.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred while updating the profile.");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        age: user.age || "",
        contactNumber: user.contactNumber || "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              My Profile
            </h1>
            <p className="text-indigo-100 text-center mt-2 text-sm sm:text-base">
              Manage your account information
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Fields - Mobile: Stack, Desktop: Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600' 
                        : 'bg-white border-gray-300 hover:border-indigo-300'
                    }`}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600' 
                        : 'bg-white border-gray-300 hover:border-indigo-300'
                    }`}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Email - Always disabled */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-3 rounded-lg border-2 bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600"
                  disabled={true}
                  readOnly={true}
                  style={{ userSelect: 'none' }}
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Email cannot be changed for security reasons
                </p>
              </div>

              {/* Age and Contact - Mobile: Stack, Desktop: Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600' 
                        : 'bg-white border-gray-300 hover:border-indigo-300'
                    }`}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600' 
                        : 'bg-white border-gray-300 hover:border-indigo-300'
                    }`}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Password - Only show when editing */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Only enter if you want to change your password
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;