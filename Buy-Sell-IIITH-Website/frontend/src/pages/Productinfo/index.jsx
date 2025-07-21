import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apicalls/products";
import { addToCart, removeFromCart, getCartItems } from "../../apicalls/cart";
import { useUser } from "../../usercontext/UserContext";
import { 
  Spin, 
  Card, 
  Typography, 
  Button, 
  message, 
  Tag, 
  Avatar,
  Divider,
  Row,
  Col
} from "antd";
import { 
  ShoppingCartOutlined, 
  MinusCircleOutlined, 
  UserOutlined, 
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const Productinfo = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
      if (user) {
        checkCartStatus();
      }
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      console.log("Product fetch response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      
      if ((response.status === 200 || response.status === 201) && response.data) {
        let productData = null;
        
        if (response.data.success && response.data.data) {
          productData = response.data.data;
        } else if (response.data.data) {
          productData = response.data.data;
        } else if (response.data.product) {
          productData = response.data.product;
        }
        
        console.log("Extracted product data:", productData);
        
        if (productData && productData._id) {
          setProduct(productData);
        } else {
          console.error("No valid product data found in response");
          console.error("Response structure:", response.data);
          message.error("Product data is incomplete");
        }
      } else {
        console.error("Invalid response status or missing data:", response.status, response.data);
        message.error("Product not found");
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      if (error.response?.status === 404) {
        message.error("Product not found");
      } else {
        message.error("Failed to load product details");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const checkCartStatus = async () => {
    if (!user) return;
    try {
      const response = await getCartItems(user._id);
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        // Check if product is in cart by looking at product IDs
        const isProductInCart = response.data.some(item => item._id === id);
        setIsInCart(isProductInCart);
      }
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user || !product) {
      message.warning("Please login to add items to cart");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isInCart) {
        response = await removeFromCart(user._id, product._id);
        if (response.status === 200) {
          message.success("Item removed from cart successfully!");
          setIsInCart(false);
        }
      } else {
        response = await addToCart(user._id, product._id);
        if (response.status === 200) {
          message.success("Item added to cart successfully!");
          setIsInCart(true);
        }
      }
    } catch (error) {
      message.error("Failed to update cart. Please try again.");
      console.error("Failed to update cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImagePlaceholder = (productName) => {
    return (
      <div className="h-64 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-lg border">
        {/* Product Image Icon */}
        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
          <svg 
            className="w-10 h-10 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        {/* Product Name */}
        <div className="text-base text-gray-600 font-semibold text-center px-4 leading-tight">
          {productName && productName.length > 30 ? 
            productName.substring(0, 30) + '...' : 
            productName || 'Product Image'}
        </div>
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">📦</div>
          <Title level={3} className="text-gray-600">Product not found</Title>
          <Text className="text-gray-500">The product you're looking for doesn't exist or has been removed.</Text>
          <Button 
            type="primary" 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isSeller = user && user._id === product.sellerId?._id;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <Row gutter={[24, 24]}>
          
          {/* Product Image Section - Made smaller */}
          <Col xs={24} lg={10}>
            <Card className="shadow-sm" styles={{ body: { padding: '16px' } }}>
              {getProductImagePlaceholder(product.category, product.name)}
            </Card>
          </Col>

          {/* Product Details Section - Made larger */}
          <Col xs={24} lg={14}>
            <div className="space-y-4">
              
              {/* Basic Info */}
              <Card className="shadow-sm" styles={{ body: { padding: '20px' } }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Title level={2} className="text-gray-800 mb-2">
                        {product.name}
                      </Title>
                      <div className="flex items-center gap-3 mb-3">
                        <Tag color="blue" className="px-3 py-1 text-sm">
                          📦 {product.category}
                        </Tag>
                        <Tag color="orange" className="px-3 py-1 text-sm">
                          🕐 {product.age} {product.age === 1 ? 'year' : 'years'} old
                        </Tag>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        ${product.price}
                      </div>
                      <Text className="text-gray-500 text-sm">Fixed Price</Text>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Title level={5} className="text-gray-700 mb-2">Description</Title>
                    <Paragraph className="text-gray-600 text-base leading-relaxed">
                      {product.description}
                    </Paragraph>
                  </div>

                  {/* Product Features */}
                  {(product.billAvailable || product.warrantyAvailable || 
                    product.boxAvailable || product.accessoriesAvailable) && (
                    <>
                      <Divider />
                      <div>
                        <Title level={5} className="text-gray-700 mb-3">What's Included</Title>
                        <div className="grid grid-cols-2 gap-2">
                          {product.billAvailable && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleOutlined />
                              <Text>Original Bill</Text>
                            </div>
                          )}
                          {product.warrantyAvailable && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleOutlined />
                              <Text>Warranty</Text>
                            </div>
                          )}
                          {product.boxAvailable && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleOutlined />
                              <Text>Original Box</Text>
                            </div>
                          )}
                          {product.accessoriesAvailable && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleOutlined />
                              <Text>All Accessories</Text>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Seller Information */}
              <Card className="shadow-sm" styles={{ body: { padding: '20px' } }}>
                <Title level={4} className="text-gray-800 mb-4 flex items-center">
                  <UserOutlined className="mr-2" />
                  Seller Information
                </Title>
                <div className="flex items-start gap-4">
                  <Avatar 
                    size={50} 
                    className="bg-indigo-500 flex-shrink-0"
                    style={{ backgroundColor: '#6366f1' }}
                  >
                    {product.sellerId?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <div className="space-y-1 flex-grow">
                    <div>
                      <Text className="text-lg font-semibold text-gray-800 block">
                        {product.sellerId?.firstName || 'Unknown'} {product.sellerId?.lastName || ''}
                      </Text>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MailOutlined className="text-sm" />
                        <Text className="text-sm">{product.sellerId?.email || 'Not available'}</Text>
                      </div>
                      {product.sellerId?.contactNumber && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <PhoneOutlined className="text-sm" />
                          <Text className="text-sm">{product.sellerId.contactNumber}</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons - MOVED HERE and made more prominent */}
              <Card className="shadow-sm border-2 border-indigo-100" styles={{ body: { padding: '20px' } }}>
                {isSeller ? (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl mb-2">🏷️</div>
                    <Title level={4} className="text-blue-800 mb-1">This is your product</Title>
                    <Text className="text-blue-600">
                      You can manage this product from your seller dashboard
                    </Text>
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={handleAddToCart}
                      className={`w-full h-14 text-lg font-semibold ${
                        isInCart 
                          ? 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600' 
                          : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700'
                      }`}
                      icon={isInCart ? <MinusCircleOutlined /> : <ShoppingCartOutlined />}
                    >
                      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </Button>
                    
                    {isInCart && (
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <Text className="text-green-700 text-sm">
                          ✅ Item is in your cart! Go to cart to complete your purchase.
                        </Text>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-3xl mb-2">🔐</div>
                    <Title level={4} className="text-yellow-800 mb-1">Login Required</Title>
                    <Text className="text-yellow-600">
                      Please login to add items to your cart
                    </Text>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>

        {/* Additional Info Section */}
        <Row className="mt-6">
          <Col span={24}>
            <Card className="shadow-sm" styles={{ body: { padding: '20px' } }}>
              <Title level={4} className="text-gray-800 mb-4">
                <ClockCircleOutlined className="mr-2" />
                Product Timeline
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600 text-sm block">Listed on</Text>
                  <Text className="font-medium">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Not available'}
                  </Text>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600 text-sm block">Product Age</Text>
                  <Text className="font-medium">
                    {product.age} {product.age === 1 ? 'year' : 'years'} old
                  </Text>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600 text-sm block">Category</Text>
                  <Tag color="purple" className="capitalize font-medium">
                    {product.category}
                  </Tag>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600 text-sm block">Status</Text>
                  <Tag color={product.status === 'available' ? 'green' : 'red'} className="capitalize font-medium">
                    {product.status || 'available'}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Productinfo;