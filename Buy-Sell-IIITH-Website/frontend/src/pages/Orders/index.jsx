import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty, Card, Tag, message } from 'antd';
import { getUserOrderHistory } from '../../apicalls/orders';
import { useUser } from '../../usercontext/UserContext';

const { TabPane } = Tabs;

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
        
        const pending = bought.filter(order => order.status === 'pending');
        const completed = bought.filter(order => order.status === 'completed');
        
        setPendingOrders(pending);
        setBoughtItems(completed);
        setSoldItems(sold);
      }
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      message.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const OrderCard = ({ order, type }) => (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{order.productId.name}</h3>
          <p className="text-gray-600">Transaction ID: {order.transactionId}</p>
          <p className="text-green-600 font-bold">Amount: ${order.amount.toFixed(2)}</p>
          {type === 'pending' && (
            <p className="text-blue-600 mt-2">
              OTP for verification: {order.plainOTP}
            </p>
          )}
          <div className="mt-2">
            <p className="text-gray-500">
              Seller: {order.sellerId.firstName}
            </p>
            <p className="text-gray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Tag color={order.status === 'completed' ? 'green' : 'gold'} className="ml-4">
          {order.status.toUpperCase()}
        </Tag>
      </div>
    </Card>
  );

  const EmptyState = ({ message }) => (
    <Empty
      description={message}
      className="my-8"
    />
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Orders History</h2>
      
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        className="bg-white rounded-lg shadow-sm p-4"
      >
        <TabPane tab="Pending Orders" key="pending">
          {pendingOrders.length > 0 ? (
            pendingOrders.map(order => (
              <OrderCard key={order._id} order={order} type="pending" />
            ))
          ) : (
            <EmptyState message="No pending orders" />
          )}
        </TabPane>

        <TabPane tab="Purchase History" key="bought">
          {boughtItems.length > 0 ? (
            boughtItems.map(order => (
              <OrderCard key={order._id} order={order} type="bought" />
            ))
          ) : (
            <EmptyState message="No purchase history" />
          )}
        </TabPane>

        <TabPane tab="Sales History" key="sold">
          {soldItems.length > 0 ? (
            soldItems.map(order => (
              <OrderCard key={order._id} order={order} type="sold" />
            ))
          ) : (
            <EmptyState message="No sales history" />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrdersHistory;
