import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty, Card, Tag, message, Badge, Alert } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getUserOrderHistory } from '../../apicalls/orders';
import { useUser } from '../../usercontext/UserContext';

const OrdersHistory = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (user) fetchOrderHistory();
  }, [user]);

  const fetchOrderHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await getUserOrderHistory(user._id);
      console.log("Response from fetchOrderHistory", response);
      if (response.status === 200) {
        const { boughtItems: bought, soldItems: sold } = response.data;
        
        const validBought = bought.filter(order => order.productId && order.sellerId);
        const validSold = sold.filter(order => order.productId && order.buyerId);
        
        const invalidBought = bought.filter(order => !order.productId || !order.sellerId);
        const invalidSold = sold.filter(order => !order.productId || !order.buyerId);
        
        if (invalidBought.length > 0) {
          console.warn('Invalid bought orders:', invalidBought);
        }
        if (invalidSold.length > 0) {
          console.warn('Invalid sold orders:', invalidSold);
        }
        
        const pending = validBought.filter(order => order.status === 'pending');
        const completed = validBought.filter(order => order.status === 'completed');
        
        setPendingOrders(pending);
        setBoughtItems(completed);
        setSoldItems(validSold);
      }
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      message.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const OrderCard = ({ order, type }) => {
    const productName = order.productId?.name || 'Product information unavailable';
    const transactionId = order.transactionId || 'N/A';
    const amount = order.amount || 0;
    const status = order.status || 'unknown';
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    const plainOTP = order.plainOTP || 'N/A';
    
    let sellerOrBuyerName = 'Unknown';
    let sellerOrBuyerLabel = '';
    
    if (type === 'sold') {
      sellerOrBuyerName = order.buyerId?.firstName || 'Unknown';
      sellerOrBuyerLabel = 'Buyer';
    } else {
      sellerOrBuyerName = order.sellerId?.firstName || 'Unknown';
      sellerOrBuyerLabel = 'Seller';
    }
    
    const hasIncompleteData = !order.productId || (!order.sellerId && type !== 'sold') || (!order.buyerId && type === 'sold');

    return (
      <Card 
        className="mb-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-indigo-500"
        styles={{ body: { padding: '16px' } }}
      >
        {hasIncompleteData && (
          <Alert
            message="Incomplete Order Data"
            description="Some information for this order is missing. Please contact support if this persists."
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="mb-4"
          />
        )}
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-grow space-y-3">
            {/* Product Name */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {productName}
              </h3>
              <p className="text-sm text-gray-500">
                Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <DollarOutlined className="text-green-600" />
              <span className="text-xl font-bold text-green-600">
                ${amount.toFixed(2)}
              </span>
            </div>

            {/* OTP for pending orders */}
            {type === 'pending' && plainOTP && plainOTP !== 'N/A' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 font-medium">
                  🔐 OTP for verification: 
                  <span className="font-mono text-lg ml-2 bg-blue-100 px-2 py-1 rounded">
                    {plainOTP}
                  </span>
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-1">
                <p>
                  <span className="font-medium">{sellerOrBuyerLabel}:</span> {sellerOrBuyerName}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Tag */}
          <div className="flex-shrink-0">
            <Tag 
              color={status === 'completed' ? 'green' : 'gold'} 
              className="px-3 py-1 text-sm font-medium"
              icon={status === 'completed' ? <ShoppingCartOutlined /> : <ClockCircleOutlined />}
            >
              {status.toUpperCase()}
            </Tag>
          </div>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ message, icon }) => (
    <div className="text-center py-16">
      <div className="text-6xl text-gray-300 mb-4">{icon}</div>
      <Empty
        description={
          <span className="text-gray-500 text-lg">{message}</span>
        }
        className="my-4"
      />
    </div>
  );

  const tabItems = [
    {
      key: 'pending',
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          <span className="hidden sm:inline">Pending Orders</span>
          <span className="sm:hidden">Pending</span>
          {pendingOrders.length > 0 && (
            <Badge count={pendingOrders.length} size="small" />
          )}
        </span>
      ),
      children: (
        <div className="min-h-96">
          {pendingOrders.length > 0 ? (
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <OrderCard key={order._id || Math.random()} order={order} type="pending" />
              ))}
            </div>
          ) : (
            <EmptyState message="No pending orders" icon="⏳" />
          )}
        </div>
      )
    },
    {
      key: 'bought',
      label: (
        <span className="flex items-center gap-2">
          <ShoppingCartOutlined />
          <span className="hidden sm:inline">Purchase History</span>
          <span className="sm:hidden">Purchases</span>
          {boughtItems.length > 0 && (
            <Badge count={boughtItems.length} size="small" />
          )}
        </span>
      ),
      children: (
        <div className="min-h-96">
          {boughtItems.length > 0 ? (
            <div className="space-y-4">
              {boughtItems.map(order => (
                <OrderCard key={order._id || Math.random()} order={order} type="bought" />
              ))}
            </div>
          ) : (
            <EmptyState message="No purchase history" icon="🛍️" />
          )}
        </div>
      )
    },
    {
      key: 'sold',
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          <span className="hidden sm:inline">Sales History</span>
          <span className="sm:hidden">Sales</span>
          {soldItems.length > 0 && (
            <Badge count={soldItems.length} size="small" />
          )}
        </span>
      ),
      children: (
        <div className="min-h-96">
          {soldItems.length > 0 ? (
            <div className="space-y-4">
              {soldItems.map(order => (
                <OrderCard key={order._id || Math.random()} order={order} type="sold" />
              ))}
            </div>
          ) : (
            <EmptyState message="No sales history" icon="💰" />
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Orders History
          </h1>
          <p className="text-gray-600">Track your purchases and sales</p>
        </div>
        
        {/* Tabs Container */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="p-6"
            size="large"
            tabBarStyle={{
              marginBottom: '24px',
              borderBottom: '2px solid #f0f0f0'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersHistory;