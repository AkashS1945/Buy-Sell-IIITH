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
        password: user.password || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(formData);
      if (response.success) {
        message.success("Profile updated successfully!");
        setUser(response.data.user);
      } else {
        message.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        {["firstName", "lastName", "email", "age", "contactNumber", "password"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={!isEditing && field !== "email"} 
            />
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Edit Profile
            </button>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
  