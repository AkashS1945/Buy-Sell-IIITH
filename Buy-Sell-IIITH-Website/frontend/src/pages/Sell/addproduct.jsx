import React from "react";
import { Modal, Form, Input, Select, Checkbox, Button, Tabs, message } from "antd";

const { TabPane } = Tabs;

const AddProductModal = ({ isVisible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  return (
    <Modal
      title="ADD PRODUCT"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>
          Save
        </Button>,
      ]}
    >
      <Tabs defaultActiveKey="1">
        {/* Product Details Tab */}
        <TabPane tab="Product Details" key="1">
          <Form form={form} layout="vertical">
            {/* Name */}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the product name" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the description" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter product description" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>

              {/* Age */}
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "Please enter the age" }]}
              >
                <Input type="number" placeholder="Enter age of the product" />
              </Form.Item>
            </div>

            {/* Category */}
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                <Select.Option value="electronics">Electronics</Select.Option>
                <Select.Option value="furniture">Furniture</Select.Option>
                <Select.Option value="Clothing">Clothing</Select.Option>
                <Select.Option value="books">Books</Select.Option>
                <Select.Option value="beauty">Beauty</Select.Option>
                <Select.Option value="sports">Sports</Select.Option>
                <Select.Option value="grocery">Grocery</Select.Option>
                <Select.Option value="others">Others</Select.Option>
              </Select>
            </Form.Item>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Bill Available */}
              <Form.Item name="billAvailable" valuePropName="checked">
                <Checkbox>Bill Available</Checkbox>
              </Form.Item>

              {/* Warranty Available */}
              <Form.Item name="warrantyAvailable" valuePropName="checked">
                <Checkbox>Warranty Available</Checkbox>
              </Form.Item>

              {/* Box Available */}
              <Form.Item name="boxAvailable" valuePropName="checked">
                <Checkbox>Box Available</Checkbox>
              </Form.Item>

              {/* Accessories Available */}
              <Form.Item name="accessoriesAvailable" valuePropName="checked">
                <Checkbox>Accessories Available</Checkbox>
              </Form.Item>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AddProductModal;
