import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../usercontext/UserContext";

function Navbar() {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
    clearUser();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/profile", label: "Profile", icon: "👤" },
    { to: "/shopping", label: "Shopping", icon: "🛍️" },
    { to: "/orders", label: "Orders", icon: "📦" },
    { to: "/delivery", label: "Delivery", icon: "🚚" },
    { to: "/cart", label: "Cart", icon: "🛒" },
    { to: "/support", label: "Support", icon: "💬" },
    { to: "/sell", label: "Sell", icon: "💰" },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                BUY/SELL
              </span>
              <span className="text-white ml-1">IIITH</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:scale-105 ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:text-white"
                  }`
                }
                onClick={closeMobileMenu}
              >
                <span className="hidden xl:inline mr-1">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* User Info - Hidden on small screens */}
                <div className="hidden md:flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {user.firstName}
                  </span>
                </div>

                {/* Logout Button - Desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/10 backdrop-blur-sm rounded-b-lg">
              {/* Mobile User Info */}
              {user && (
                <div className="flex items-center space-x-3 px-3 py-3 mb-2 bg-white/10 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white font-medium block">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-white/70 text-sm">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile Logout */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-base font-medium transition-all duration-200 mt-4"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;