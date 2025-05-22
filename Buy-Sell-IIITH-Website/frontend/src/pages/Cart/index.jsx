import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart } from '../../apicalls/cart';
import { placeOrder } from "../../apicalls/orders";
import { getProductById } from "../../apicalls/products"; 
import { useUser } from "../../usercontext/UserContext";
import { Spin, Button, message, Modal } from 'antd';

const Cart = () => {
  const { user } = useUser();
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderOTP, setOrderOTP] = useState(null);

  useEffect(() => {
    if (user) fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await getCartItems(user._id);

      if (response.status === 200) {
        fetchProductDetails(response.data);
        // setCartProducts(response.data);
        // calculateTotal(response.data);
      }
    } catch (error) {
      message.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };


  const fetchProductDetails = async (productIds) => {
    try {
      const productDetails = await Promise.all(
        productIds.map(async (id) => {
          const response = await getProductById(id);
          return response.status === 201 ? response.data.product : null;
        })
      );
      console.log(productDetails);
      setCartProducts(productDetails.filter((product) => product !== null));
      calculateTotal(productDetails);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      message.error("Error fetching product details.");
    }
  };



  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };


    const handleRemoveFromCart = async (productId) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await removeFromCart(user._id, productId);
      if (response.status === 200) {
        message.success("Item removed from cart!");
        fetchCartItems();
      } else {
        message.error("Failed to remove item.");
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      message.error("Error removing item.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cartProducts.length === 0) return;

    setLoading(true);
    try {
      const response = await placeOrder(user._id, cartProducts);
      if (response.status === 200) {
        setOrderOTP(response.data.otp);
        message.success('Order placed successfully!');

        Modal.success({
          title: 'Order Placed Successfully',
          content: (
            <div>
              <p>Your order has been placed successfully!</p>
              <p>Your OTP for all items: {response.data.otp}</p>
              <p>Please save this OTP to complete the transaction with sellers.</p>
            </div>
          ),
        });
        setCartProducts([]);
        setTotalPrice(0);
      }
    } catch (error) {
      message.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {cartProducts.length > 0 ? (
              cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-white"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-green-600 font-bold">${item.price}</p>
                    <p className="text-gray-500">Seller: {item.sellerId.firstName}</p>
                  </div>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <Button
              type="primary"
              size="large"
              className="mt-4 w-full"
              onClick={handlePlaceOrder}
              disabled={cartProducts.length === 0}
            >
              Place Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
