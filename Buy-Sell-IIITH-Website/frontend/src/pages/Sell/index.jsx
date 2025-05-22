import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import AddProductModal from "./addproduct";
import { useUser } from "../../usercontext/UserContext";
import { addProduct, getAllProducts } from "../../apicalls/products";
import { deleteProduct } from "../../apicalls/products";

const Sell = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const { user } = useUser(); 

  const fetchProducts = async () => {
    try {
        console.log(user._id);
        console.log("fetching products");
        const data = await getAllProducts({seller: user._id}); 
      // if (response.status === 201) {
        console.log(data);
        setProducts(data);
      // } else {
      //   message.error(response.message || "Failed to fetch products");
      // }
    } catch (error) {
      message.error("An error occurred while fetching products");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.status === 201) {
        message.success("Product deleted successfully");
        fetchProducts();
      } else {
        message.error(response.message || "Failed to delete product");
      }
    } catch (error) {
      message.error("An error occurred while deleting the product");
      console.error(error);
    }
  };


  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleSaveProduct = async (values) => {
    try {
      const payload = {
        ...values,
        sellerId: user._id,
      };

      const response = await addProduct(payload);
      if (response.status === 201) {
        message.success("Product added successfully");
        setIsModalVisible(false);
        fetchProducts();
      } else {
        message.error(response.message || "Failed to add product");
      }
    } catch (error) {
      message.error("An error occurred while adding the product");
      console.error(error);
    }
  };

 

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => record.sellerId.firstName,

    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
       title: "Added on",
         dataIndex: "createdAt",
         render: (text, record) => new Date(record.createdAt).toLocaleString(),
    },
    {
        title: "Actions",
        key: "actions",
        render: (text, record) => (
          <Button
            type="danger"
            onClick={() => handleDeleteProduct(record._id)}
          >
            Delete
          </Button>
        ),
      },
  ];

 


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Products</h2>
        <Button type="primary" onClick={handleOpenModal}>
          Add Product
        </Button>
      </div>
      <Table dataSource={products} columns={columns} rowKey="_id" />
      <AddProductModal
        isVisible={isModalVisible}
        onCancel={handleCloseModal}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Sell; 