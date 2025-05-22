import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apicalls/products";
import { addToCart, removeFromCart, getCartItems } from "../../apicalls/cart";
import { useUser } from "../../usercontext/UserContext";
import { Button, message, Spin } from "antd";
import  iiit_logo from "../../assets/iiit_logo.png";

const ProductInfo = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkCartStatus();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      if (response.status === 201) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  const checkCartStatus = async () => {
    if (!user) return;
    try {
      const response = await getCartItems(user._id);
      if (response.status === 200 && response.data.includes(id)) {
        setIsInCart(true);
      }
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user || !product) return;
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

  if (!product) {
    return <Spin size="large" />;
  }

  const isSeller = user && product.sellerId && user._id === product.sellerId._id;

  return (
    <div className="p-6 flex gap-6">
      {/* Product Image */}
      <div className="w-1/2">
        <img
          src={iiit_logo}
          alt={product.name}
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="w-1/2">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>

        <div className="mt-4">
          <h3 className="font-semibold text-lg">Product Details</h3>
          <ul className="list-disc ml-6">
            <li>Category: {product.category}</li>
            <li>Price: ${product.price}</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Owner Details</h3>
          <p className="text-gray-700">Name: {product.sellerId.firstName}</p>
          <p className="text-gray-700">Email: {product.sellerId.email}</p>
        </div>

        <div className="mt-6">
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleAddToCart}
            disabled={isSeller}
            
          >
           {isInCart ? "Remove from Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

