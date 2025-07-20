import React from "react";
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Button, 
  message, 
  Typography,
  Divider
} from "antd";
import { 
  ShopOutlined, 
  DollarOutlined, 
  TagOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AddProductModal = ({ isVisible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values); // Debug log
        
        // Ensure all required fields are present and properly formatted
        const formattedValues = {
          name: values.name?.trim(),
          description: values.description?.trim(),
          price: parseFloat(values.price),
          age: parseInt(values.age),
          category: values.category,
          billAvailable: values.billAvailable || false,
          warrantyAvailable: values.warrantyAvailable || false,
          boxAvailable: values.boxAvailable || false,
          accessoriesAvailable: values.accessoriesAvailable || false
        };
        
        console.log("Formatted values:", formattedValues); // Debug log
        
        onSave(formattedValues);
        form.resetFields();
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
        
        // Show specific validation errors
        const errorFields = error.errorFields;
        if (errorFields && errorFields.length > 0) {
          const firstError = errorFields[0];
          message.error(`${firstError.name[0]}: ${firstError.errors[0]}`);
        } else {
          message.error("Please fill in all required fields correctly");
        }
      });
  };

  const categories = [
    { value: "electronics", label: "Electronics", icon: "📱" },
    { value: "furniture", label: "Furniture", icon: "🪑" },
    { value: "clothing", label: "Clothing", icon: "👕" },
    { value: "books", label: "Books", icon: "📚" },
    { value: "beauty", label: "Beauty", icon: "💄" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "grocery", label: "Grocery", icon: "🛒" },
    { value: "others", label: "Others", icon: "📦" },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <ShopOutlined className="text-indigo-600 text-lg" />
          </div>
          <div>
            <Title level={4} className="mb-0 text-gray-800">Add New Product</Title>
            <Text className="text-gray-500 text-sm">Fill in the details to list your product</Text>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      width={600}
      className="top-4"
      footer={[
        <Button key="cancel" onClick={onCancel} size="large">
          Cancel
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          onClick={handleSubmit}
          size="large"
          className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
        >
          Add Product
        </Button>,
      ]}
      styles={{ 
        body: { 
          maxHeight: '70vh', 
          overflowY: 'auto',
          padding: '24px' 
        } 
      }}
    >
      <div className="pt-4">
        <Form 
          form={form} 
          layout="vertical" 
          size="large"
          validateTrigger={['onBlur', 'onChange']}
        >
          {/* Product Name */}
          <Form.Item
            label={
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <FileTextOutlined />
                Product Name
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Please enter the product name" },
              { min: 3, message: "Product name must be at least 3 characters" },
              { max: 100, message: "Product name cannot exceed 100 characters" }
            ]}
          >
            <Input 
              placeholder="Enter product name" 
              className="rounded-lg"
              autoComplete="off"
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label={
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <FileTextOutlined />
                Description
              </span>
            }
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
              { min: 10, message: "Description must be at least 10 characters" },
              { max: 500, message: "Description cannot exceed 500 characters" }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe your product in detail..."
              className="rounded-lg"
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* Price and Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <DollarOutlined />
                  Price ($)
                </span>
              }
              name="price"
              rules={[
                { required: true, message: "Please enter the price" },
                { 
                  validator: (_, value) => {
                    const numValue = parseFloat(value);
                    if (value && (isNaN(numValue) || numValue <= 0)) {
                      return Promise.reject(new Error('Price must be a valid number greater than 0'));
                    }
                    if (value && numValue > 999999) {
                      return Promise.reject(new Error('Price cannot exceed $999,999'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                type="number" 
                placeholder="0.00" 
                className="rounded-lg"
                min={0.01}
                max={999999}
                step={0.01}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <CalendarOutlined />
                  Age (years)
                </span>
              }
              name="age"
              rules={[
                { required: true, message: "Please enter the age" },
                { 
                  validator: (_, value) => {
                    const numValue = parseInt(value);
                    if (value && (isNaN(numValue) || numValue < 0 || numValue > 50)) {
                      return Promise.reject(new Error('Please enter a valid age between 0-50 years'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                type="number" 
                placeholder="How old is the product?" 
                className="rounded-lg"
                min={0}
                max={50}
              />
            </Form.Item>
          </div>

          {/* Category */}
          <Form.Item
            label={
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <TagOutlined />
                Category
              </span>
            }
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select 
              placeholder="Select a category" 
              className="rounded-lg"
              size="large"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map(cat => (
                <Select.Option key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider className="my-6">
            <Text className="text-gray-500">Additional Information</Text>
          </Divider>

          {/* Checkboxes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-700 font-medium mb-4 block">What's included?</Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Form.Item name="billAvailable" valuePropName="checked" className="mb-2">
                <Checkbox className="text-gray-700">
                  <span className="flex items-center gap-2">
                    📄 Original Bill/Receipt
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="warrantyAvailable" valuePropName="checked" className="mb-2">
                <Checkbox className="text-gray-700">
                  <span className="flex items-center gap-2">
                    🛡️ Warranty Available
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="boxAvailable" valuePropName="checked" className="mb-2">
                <Checkbox className="text-gray-700">
                  <span className="flex items-center gap-2">
                    📦 Original Box
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="accessoriesAvailable" valuePropName="checked" className="mb-2">
                <Checkbox className="text-gray-700">
                  <span className="flex items-center gap-2">
                    🔌 All Accessories
                  </span>
                </Checkbox>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddProductModal;