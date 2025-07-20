import { Button } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Delivery from './pages/Delivery';
import Cart from './pages/Cart';  
import Support from './pages/Support';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedPage from './components/ProtectedPage';
import { UserProvider } from './usercontext/UserContext';
import Sell from './pages/Sell';
import Productinfo from './pages/Productinfo';
import OrderHistory from './pages/Orders';
import DeliverPage from './pages/Delivery';

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            {/* Public routes should NOT be wrapped with UserProvider */}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            
            {/* Protected routes must be wrapped with UserProvider */}
            <Route path="/*" element={
              <UserProvider>
                <Routes>
                  <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>}></Route>
                  <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>}></Route>
                  <Route path="/shopping" element={<ProtectedPage><Home /></ProtectedPage>}></Route>
                  <Route path='/product/:id' element={<ProtectedPage><Productinfo /></ProtectedPage>}></Route>
                  <Route path="/orders" element={<ProtectedPage><OrderHistory /></ProtectedPage>}></Route>
                  <Route path="/delivery" element={<ProtectedPage><DeliverPage /></ProtectedPage>}></Route>
                  <Route path="/cart" element={<ProtectedPage><Cart /></ProtectedPage>}></Route>
                  <Route path="/support" element={<ProtectedPage><Support /></ProtectedPage>}></Route>
                  <Route path="/Sell" element={<ProtectedPage><Sell /></ProtectedPage>}></Route>
                </Routes>
              </UserProvider>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;