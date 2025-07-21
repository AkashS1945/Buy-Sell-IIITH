import React, { useEffect, useState } from 'react';
import { getProductById } from "../../apicalls/products"; 
import { useUser } from "../../usercontext/UserContext";
import { Spin, Button, message, Modal, Card, Typography, Divider, Empty } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, DollarOutlined, TagOutlined } from '@ant-design/icons';
import { addToCart, removeFromCart, getCartItems, clearCart } from '../../apicalls/cart';
import { placeOrder } from "../../apicalls/orders";

const { Title, Text } = Typography;

const Cart = () => {
  const userContext = useUser();
  
  if (!userContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading user context...</p>
        </div>
      </div>
    );
  }

  const { user } = userContext;
  
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderOTP, setOrderOTP] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user?._id) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await getCartItems(user._id);
      
      if (response.status === 200) {
        const cartData = response.data;
        console.log("Raw cart data received:", cartData);
        console.log("Cart data type:", typeof cartData);
        console.log("Is array:", Array.isArray(cartData));
        
        if (cartData && cartData.length > 0) {
          console.log("Sample cart item:", cartData[0]);
          console.log("Sample cart item keys:", Object.keys(cartData[0] || {}));
        }
        
        if (Array.isArray(cartData) && cartData.length > 0) {
          const validProducts = cartData.filter(product => 
            product && product._id && product.name && typeof product.price === 'number'
          );
          
          console.log("Valid products:", validProducts);
          setCartProducts(validProducts);
          
          const total = validProducts.reduce((sum, product) => sum + (product.price || 0), 0);
          setTotalPrice(total);
        } else {
          setCartProducts([]);
          setTotalPrice(0);
        }
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to load cart items');
      setCartProducts([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item && typeof item.price === 'number' ? item.price : 0;
      return sum + price;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (productId) => {
    if (!user?._id) return;
    
    try {
      const response = await removeFromCart(user._id, productId);
      if (response.status === 200) {
        message.success('Item removed from cart');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      message.error('Failed to remove item from cart');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cartProducts.length === 0) return;

    setLoading(true);
    try {
      console.log('Placing order with:', {
        buyerId: user._id,
        cartItems: cartProducts
      });

      const response = await placeOrder(user._id, cartProducts);
      console.log('Order response:', response);
      
      if (response.status === 200) {
        await clearCart(user._id);
        
        setCartProducts([]);
        setTotalPrice(0);
        
        message.success(`${cartProducts.length} order(s) placed successfully!`);
        
        if (response.data.otp) {
          Modal.success({
            title: 'Order Placed Successfully!',
            content: (
              <div className="space-y-4">
                <p>Your order has been placed. Here's your OTP for delivery verification:</p>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <p className="text-sm text-green-600 mb-2">Delivery OTP</p>
                  <p className="text-3xl font-mono font-bold text-green-800">
                    {response.data.otp}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Please provide this OTP to the seller during delivery.
                </p>
              </div>
            ),
            width: 450,
            okText: 'Got it!',
          });
        }
      } else {
        throw new Error('Order placement failed');
      }
      
    } catch (error) {
      console.error('Error placing orders:', error);
      message.error('Failed to place orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProductImagePlaceholder = (category, name) => {
    const placeholders = {
      electronics: '📱',
      books: '📚',
      furniture: '🪑',
      clothing: '👕',
      sports: '⚽',
      default: '📦'
    };
    
    const icon = placeholders[category?.toLowerCase()] || placeholders.default;
    
    return (
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-3xl border border-indigo-200">
        {icon}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <ShoppingCartOutlined className="mr-3 text-indigo-600" />
            Shopping Cart
          </Title>
          <Text className="text-gray-600">
            {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
          </Text>
        </div>

        {loading && cartProducts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Loading your cart...</p>
            </div>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-6">🛒</div>
            <Empty
              description={
                <div className="space-y-2">
                  <Title level={4} className="text-gray-600">Your cart is empty</Title>
                  <Text className="text-gray-500">Browse products and add them to your cart!</Text>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((product) => {
                
                return (
                  <Card 
                    key={product._id} 
                    className="shadow-sm hover:shadow-md transition-shadow"
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="flex gap-4">
                      {getProductImagePlaceholder(product.category, product.name)}
                      
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Title level={5} className="text-gray-800 mb-1 line-clamp-1">
                              {product.name || 'Unknown Product'}
                            </Title>
                            <Text className="text-gray-500 text-sm line-clamp-2">
                              {product.description || 'No description available'}
                            </Text>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveFromCart(product._id)}
                            className="flex-shrink-0 ml-2"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <TagOutlined className="text-blue-500" />
                            <Text className="text-sm text-gray-600 capitalize">
                              {product.category || 'uncategorized'}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              • {product.age || 0} {(product.age === 1) ? 'year' : 'years'} old
                            </Text>
                          </div>
                          <Text className="text-xl font-bold text-green-600">
                            ${(product.price || 0).toFixed(2)}
                          </Text>
                        </div>

                        {/* Product Features */}
                        {(product.billAvailable || product.warrantyAvailable || 
                          product.boxAvailable || product.accessoriesAvailable) && (
                          <div className="flex gap-2 mt-2">
                            {product.billAvailable && <span title="Bill Available" className="text-xs">📄</span>}
                            {product.warrantyAvailable && <span title="Warranty Available" className="text-xs">🛡️</span>}
                            {product.boxAvailable && <span title="Original Box" className="text-xs">📦</span>}
                            {product.accessoriesAvailable && <span title="All Accessories" className="text-xs">🔌</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm sticky top-6">
                <Title level={4} className="text-gray-800 mb-4 flex items-center">
                  <DollarOutlined className="mr-2 text-green-600" />
                  Order Summary
                </Title>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    {cartProducts.map((product) => (
                      <div key={product._id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate pr-2">{product.name}</span>
                        <span className="text-gray-800 font-medium">${(product.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Divider className="my-4" />
                  
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <Text className="text-gray-800">Total:</Text>
                    <Text className="text-2xl text-green-600">
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </div>
                  
                  <Button
                    type="primary"
                    size="large"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
                    onClick={handlePlaceOrder}
                    disabled={cartProducts.length === 0}
                    loading={loading}
                    icon={<ShoppingCartOutlined />}
                  >
                    Place Order
                  </Button>
                  
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;