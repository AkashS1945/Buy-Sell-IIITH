import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  message, 
  Spin, 
  Modal, 
  Empty, 
  Typography,
  Tag,
  Space,
  Avatar,
  Alert
} from 'antd';
import { 
  TruckOutlined, 
  UserOutlined, 
  DollarOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getSellerPendingOrders, verifyAndCompleteOrder } from '../../apicalls/orders';
import { useUser } from '../../usercontext/UserContext';

const { Title, Text } = Typography;

const DeliveryPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  const otpInputRef = useRef(null);
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (user) fetchPendingOrders();
  }, [user]);

  useEffect(() => {
    if (modalOpen && shouldFocusRef.current) {
      const focusTimer = setTimeout(() => {
        if (otpInputRef.current && modalOpen) {
          otpInputRef.current.focus();
          shouldFocusRef.current = false;
        }
      }, 200);
      return () => clearTimeout(focusTimer);
    }
  }, [modalOpen, otpInput]);

  const fetchPendingOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await getSellerPendingOrders(user._id);
      console.log('Pending orders response:', response);
      if (response.status === 200) {
        const validOrders = response.data.orders.filter(order => 
          order.productId && order.buyerId
        );
        setPendingOrders(validOrders);
        
        const invalidOrders = response.data.orders.filter(order => 
          !order.productId || !order.buyerId
        );
        if (invalidOrders.length > 0) {
          console.warn('Found orders with missing data:', invalidOrders);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
      message.error('Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (orderId) => {
    if (!otpInput.trim() || otpInput.length !== 6) {
      message.warning('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await verifyAndCompleteOrder(orderId, otpInput);
      if (response.status === 200) {
        message.success('Order completed successfully!');
        handleCloseModal();
        await fetchPendingOrders();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error('Invalid OTP. Please try again.');
        setOtpInput('');
        shouldFocusRef.current = true;
        setTimeout(() => {
          if (otpInputRef.current && modalOpen) {
            otpInputRef.current.focus();
            shouldFocusRef.current = false;
          }
        }, 150);
      } else {
        message.error('Failed to verify OTP');
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedOrder(null);
    setOtpInput('');
    setVerifyingOtp(false);
  }, []);

  const handleOpenModal = useCallback((order) => {
    if (!modalOpen && !selectedOrder) {
      setSelectedOrder(order);
      setOtpInput('');
      shouldFocusRef.current = true;
      setModalOpen(true);
    }
  }, [modalOpen, selectedOrder]);

  const handleOtpChange = useCallback((e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    
    if (numericValue !== otpInput) {
      setOtpInput(numericValue);
    }
  }, [otpInput]);

  const handleOtpKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && otpInput.length === 6 && !verifyingOtp) {
      handleVerifyOTP(selectedOrder?._id);
    }
    if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  }, [otpInput, verifyingOtp, selectedOrder, handleVerifyOTP]);

  const VerificationModal = () => {
    return (
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafetyCertificateOutlined className="text-green-600 text-lg" />
            </div>
            <div>
              <Title level={4} className="mb-0 text-gray-800">Verify OTP</Title>
              <Text className="text-gray-500 text-sm">Complete the delivery</Text>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button 
            key="cancel" 
            onClick={handleCloseModal}
            size="large"
            disabled={verifyingOtp}
          >
            Cancel
          </Button>,
          <Button
            key="verify"
            type="primary"
            loading={verifyingOtp}
            onClick={() => handleVerifyOTP(selectedOrder?._id)}
            size="large"
            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
            icon={<CheckCircleOutlined />}
            disabled={!otpInput || otpInput.length !== 6 || verifyingOtp}
          >
            {verifyingOtp ? 'Verifying...' : 'Verify & Complete'}
          </Button>
        ]}
        width={500}
        maskClosable={false}
        keyboard={false}
        destroyOnClose={true}
        centered
        afterClose={() => {
          setSelectedOrder(null);
          setOtpInput('');
          setVerifyingOtp(false);
        }}
      >
        <div className="py-6">
          {selectedOrder && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Title level={5} className="text-blue-800 mb-2">Order Details</Title>
              <div className="space-y-1 text-sm">
                <p><strong>Product:</strong> {selectedOrder.productId?.name || 'Product information unavailable'}</p>
                <p><strong>Amount:</strong> ${selectedOrder.amount?.toFixed(2) || '0.00'}</p>
                <p><strong>Buyer:</strong> {selectedOrder.buyerId?.firstName || 'Unknown'} {selectedOrder.buyerId?.lastName || ''}</p>
                <p><strong>Transaction ID:</strong> {selectedOrder.transactionId || 'N/A'}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <Text className="text-gray-700 block">
              Please enter the 6-digit OTP provided by the buyer to complete this delivery.
            </Text>
            
            <Input
              ref={otpInputRef}
              placeholder="Enter 6-digit OTP"
              value={otpInput}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyPress}
              maxLength={6}
              className="text-center text-xl font-mono tracking-widest"
              size="large"
              style={{ letterSpacing: '0.5em' }}
              disabled={verifyingOtp}
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              onBlur={(e) => {
                if (modalOpen && !verifyingOtp) {
                  setTimeout(() => {
                    if (otpInputRef.current && modalOpen) {
                      otpInputRef.current.focus();
                    }
                  }, 10);
                }
              }}
            />
            
            <div className="text-center">
              <Text className="text-xs text-gray-500">
                Make sure the buyer is present and has provided the correct OTP
              </Text>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const OrderCard = ({ order }) => {
    const productName = order.productId?.name || 'Product information unavailable';
    const buyerFirstName = order.buyerId?.firstName || 'Unknown';
    const buyerLastName = order.buyerId?.lastName || '';
    const amount = order.amount || 0;
    const transactionId = order.transactionId || 'N/A';
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

    const hasIncompleteData = !order.productId || !order.buyerId;

    const handleCompleteDelivery = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!modalOpen && !hasIncompleteData && !selectedOrder && !verifyingOtp) {
        handleOpenModal(order);
      }
    }, [modalOpen, hasIncompleteData, selectedOrder, verifyingOtp, order, handleOpenModal]);

    const isCurrentOrder = selectedOrder?._id === order._id;

    return (
      <Card 
        className="mb-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500"
        styles={{ body: { padding: '20px' } }}
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
          <div className="flex-grow space-y-4">
            {/* Product Info */}
            <div>
              <Title level={4} className="text-gray-800 mb-1 line-clamp-1">
                {productName}
              </Title>
              <Text className="text-sm text-gray-500 font-mono">
                ID: {transactionId}
              </Text>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <DollarOutlined className="text-green-600 text-lg" />
              <Text className="text-2xl font-bold text-green-600">
                ${amount.toFixed(2)}
              </Text>
            </div>

            {/* Buyer and Date Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Avatar 
                  size={40} 
                  className="bg-indigo-500 flex-shrink-0"
                  icon={<UserOutlined />}
                >
                  {buyerFirstName?.charAt(0)?.toUpperCase() || '?'}
                </Avatar>
                <div>
                  <Text className="font-medium text-gray-800 block">
                    {buyerFirstName} {buyerLastName}
                  </Text>
                  <Text className="text-sm text-gray-500">Buyer</Text>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-gray-400" />
                <div>
                  <Text className="text-sm text-gray-600 block">
                    {createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <Text className="text-xs text-gray-500">Order Date</Text>
                </div>
              </div>
            </div>

            {/* Status Tag */}
            <div>
              <Tag color="orange" className="px-3 py-1">
                <TruckOutlined className="mr-1" />
                Pending Delivery
              </Tag>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 lg:ml-4">
            <Button
              type="primary"
              size="large"
              onClick={handleCompleteDelivery}
              className="w-full lg:w-auto bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              icon={<CheckCircleOutlined />}
              disabled={hasIncompleteData || modalOpen || verifyingOtp}
              loading={isCurrentOrder && (modalOpen || verifyingOtp)}
            >
              {isCurrentOrder && modalOpen ? 
                'Processing...' : 
                'Complete Delivery'
              }
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading pending deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <TruckOutlined className="mr-3 text-orange-600" />
            Pending Deliveries
          </Title>
          <Text className="text-gray-600">
            {pendingOrders.length} {pendingOrders.length === 1 ? 'delivery' : 'deliveries'} waiting for completion
          </Text>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6">
            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl text-gray-300 mb-4">🚚</div>
                <Title level={4} className="text-gray-600 mb-2">No pending deliveries</Title>
                <Text className="text-gray-500">
                  All caught up! New orders will appear here when customers make purchases.
                </Text>
              </div>
            )}
          </div>
        </div>

        <VerificationModal />
      </div>
    </div>
  );
};

export default DeliveryPage;