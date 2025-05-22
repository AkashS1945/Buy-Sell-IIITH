import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Spin, Modal, Empty } from 'antd';
import { getSellerPendingOrders, verifyAndCompleteOrder } from '../../apicalls/orders';
import { useUser } from '../../usercontext/UserContext';

const DeliveryPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    if (user) fetchPendingOrders();
  }, [user]);

  const fetchPendingOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await getSellerPendingOrders(user._id);
      if (response.status === 200) {
        setPendingOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
      message.error('Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (orderId) => {
    if (!otpInput.trim()) {
      message.warning('Please enter OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await verifyAndCompleteOrder(orderId, otpInput);
      if (response.status === 200) {
        message.success('Order completed successfully!');
        setSelectedOrder(null);
        setOtpInput('');
        fetchPendingOrders();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error('Invalid OTP. Please try again.');
      } else {
        message.error('Failed to verify OTP');
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const VerificationModal = () => (
    <Modal
      title="Verify OTP"
      open={!!selectedOrder}
      onCancel={() => {
        setSelectedOrder(null);
        setOtpInput('');
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setSelectedOrder(null);
            setOtpInput('');
          }}
        >
          Cancel
        </Button>,
        <Button
          key="verify"
          type="primary"
          loading={verifyingOtp}
          onClick={() => handleVerifyOTP(selectedOrder._id)}
        >
          Verify & Complete
        </Button>
      ]}
    >
      <div className="py-4">
        <p className="mb-4">Please enter the OTP provided by the buyer to complete this transaction.</p>
        <Input
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          maxLength={6}
          className="text-center text-lg"
          size="large"
        />
      </div>
    </Modal>
  );

  const OrderCard = ({ order }) => (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{order.productId.name}</h3>
          <p className="text-gray-600">Transaction ID: {order.transactionId}</p>
          <p className="text-green-600 font-bold">Amount: ${order.amount.toFixed(2)}</p>
          <div className="mt-2">
            <p className="text-gray-500">
              Buyer: {order.buyerId.firstName}
            </p>
            <p className="text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          type="primary"
          onClick={() => setSelectedOrder(order)}
          className="ml-4"
        >
          Complete Delivery
        </Button>
      </div>
    </Card>
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
      <h2 className="text-2xl font-bold mb-6">Pending Deliveries</h2>
      
      {pendingOrders.length > 0 ? (
        <div className="space-y-4">
          {pendingOrders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <Empty description="No pending deliveries" />
      )}

      <VerificationModal />
    </div>
  );
};

export default DeliveryPage;