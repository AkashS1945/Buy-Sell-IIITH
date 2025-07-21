import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { UserProvider } from './usercontext/UserContext';
import ProtectedPage from './components/ProtectedPage';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Sell from './pages/Sell';
import Support from './pages/Support';
import Orders from './pages/Orders';
import Delivery from './pages/Delivery';
import Productinfo from './pages/Productinfo';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>} />
            <Route path="/shopping" element={<ProtectedPage><Home /></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            <Route path="/cart" element={<ProtectedPage><Cart /></ProtectedPage>} />
            <Route path="/sell" element={<ProtectedPage><Sell /></ProtectedPage>} />
            <Route path="/support" element={<ProtectedPage><Support /></ProtectedPage>} />
            <Route path="/orders" element={<ProtectedPage><Orders /></ProtectedPage>} />
            <Route path="/delivery" element={<ProtectedPage><Delivery /></ProtectedPage>} />
            <Route path="/product/:id" element={<ProtectedPage><Productinfo /></ProtectedPage>} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<ProtectedPage><Home /></ProtectedPage>} />
          </Routes>
        </UserProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;