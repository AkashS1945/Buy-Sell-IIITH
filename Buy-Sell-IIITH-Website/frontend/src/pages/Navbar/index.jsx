import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../usercontext/UserContext";


function Navbar() {
  const { user,clearUser } = useUser();

  const navigate = useNavigate();

  return (
    <nav className="bg-primary text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Project Name */}
        <h1 className="text-3xl font-bold">BUY/SELL IIITH</h1>

        {/* Links */}
        <div className="flex space-x-6">
          <NavLink to="/profile" className="hover:text-gray-300">Profile</NavLink>
          <NavLink to="/shopping" className="hover:text-gray-300">Go Shopping</NavLink>
          <NavLink to="/orders" className="hover:text-gray-300">Order History</NavLink>
          <NavLink to="/delivery" className="hover:text-gray-300">Delivery Items</NavLink>
          <NavLink to="/cart" className="hover:text-gray-300">Cart</NavLink>
          <NavLink to="/support" className="hover:text-gray-300">Support</NavLink>
          <NavLink to="/sell" className="hover:text-gray-300">Sell</NavLink>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <i className="ri-shield-user-fill text-xl"></i>
              <span>{user.firstName}</span>
              <button
                onClick={() => {
                  console.log("Logout clicked");
                  // localStorage.removeItem("token");
                  clearUser();
                  // dispatch(SetUser(null));
                  navigate("/login");
                }}
                className="text-red-500 hover:text-red-700"
              >
                <i className="ri-logout-box-r-line text-xl"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
