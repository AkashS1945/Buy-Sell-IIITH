import React, { useState, useEffect } from "react";
import { Button, Table, message, Card, Typography, Popconfirm, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import AddProductModal from "./addproduct";
import { useUser } from "../../usercontext/UserContext";
import { addProduct, getAllProducts, deleteProduct } from "../../apicalls/products";

const { Title, Text } = Typography;

const Sell = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const { user } = useUser(); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products for user:", user._id);
      const response = await getAllProducts(); // Get all products first
      console.log("Products fetched:", response);
      
      // Filter products by current user
      const userProducts = response.filter(product => 
        product.sellerId && product.sellerId._id === user._id
      );
      
      console.log("User products:", userProducts);
      setProducts(userProducts || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchProducts();
    }
  }, [user]);

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
      console.error("Error deleting product:", error);
      message.error("Failed to delete product. Please try again.");
    }
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setAddingProduct(false);
  };

  const handleSaveProduct = async (values) => {
    if (!user?._id) {
      message.error("User information not found. Please refresh and try again.");
      return;
    }

    setAddingProduct(true);
    try {
      console.log("Adding product with values:", values);
      
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        age: values.age,
        category: values.category,
        billAvailable: values.billAvailable,
        warrantyAvailable: values.warrantyAvailable,
        boxAvailable: values.boxAvailable,
        accessoriesAvailable: values.accessoriesAvailable,
        sellerId: user._id,
      };

      console.log("Payload being sent:", payload);

      const response = await addProduct(payload);
      console.log("Add product response:", response);
      
      if (response.status === 201) {
        message.success("Product added successfully! 🎉");
        setIsModalVisible(false);
        fetchProducts();
      } else {
        message.error(response.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      
      // More specific error handling
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 500) {
        message.error("Server error. Please check your data and try again.");
      } else if (error.response?.status === 400) {
        message.error("Invalid data. Please check all fields and try again.");
      } else {
        message.error("Failed to add product. Please try again.");
      }
    } finally {
      setAddingProduct(false);
    }
  };

  // Desktop table columns
  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <Text strong className="text-gray-800">{text}</Text>
          <br />
          <Text className="text-sm text-gray-500 line-clamp-2">{record.description}</Text>
        </div>
      ),
      responsive: ['lg'],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text className="text-lg font-semibold text-green-600">${price?.toFixed(2)}</Text>
      ),
      responsive: ['lg'],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue" className="capitalize">{category}</Tag>
      ),
      responsive: ['lg'],
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text) => (
        <Text className="text-sm text-gray-500">
          {text ? new Date(text).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'N/A'}
        </Text>
      ),
      responsive: ['lg'],
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Delete Product"
          description="Are you sure you want to delete this product?"
          onConfirm={() => handleDeleteProduct(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Delete
          </Button>
        </Popconfirm>
      ),
      responsive: ['lg'],
    },
  ];

  // Mobile card component
  const ProductCard = ({ product }) => (
    <Card 
      className="mb-4 shadow-sm hover:shadow-md transition-all duration-300 border"
      styles={{ body: { padding: '16px' } }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <Title level={5} className="text-gray-800 mb-1 line-clamp-1">
              {product.name}
            </Title>
            <Text className="text-lg font-semibold text-green-600">
              ${product.price?.toFixed(2)}
            </Text>
          </div>
          <Popconfirm
            title="Delete Product"
            description="Are you sure?"
            onConfirm={() => handleDeleteProduct(product._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </div>

        <Text className="text-gray-600 text-sm line-clamp-2 block">
          {product.description}
        </Text>

        <div className="flex justify-between items-center">
          <Tag color="blue" className="capitalize">
            {product.category}
          </Tag>
          <Text className="text-xs text-gray-500">
            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <Title level={2} className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
                <ShopOutlined className="mr-3 text-indigo-600" />
                My Products
              </Title>
              <Text className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} listed
              </Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              size="large"
              loading={addingProduct}
              className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
            >
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table 
              dataSource={products} 
              columns={columns} 
              rowKey="_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} products`,
              }}
              className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-gray-700"
            />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <Text className="text-gray-600">Loading products...</Text>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl text-gray-300 mb-4">📦</div>
                <Title level={4} className="text-gray-600 mb-2">No products yet</Title>
                <Text className="text-gray-500 mb-6">Start selling by adding your first product!</Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleOpenModal}
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Your First Product
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isVisible={isModalVisible}
          onCancel={handleCloseModal}
          onSave={handleSaveProduct}
        />
      </div>
    </div>
  );
};

export default Sell;