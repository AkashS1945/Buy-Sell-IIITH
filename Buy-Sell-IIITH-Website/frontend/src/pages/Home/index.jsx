import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../apicalls/products";
import { message, Spin, Input, Select, Button, Card, Empty, Checkbox, Collapse } from "antd";
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [ageRange, setAgeRange] = useState("");
  const navigate = useNavigate();

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

  const features = [
    { value: "billAvailable", label: "Original Bill" },
    { value: "warrantyAvailable", label: "Warranty Available" },
    { value: "boxAvailable", label: "Original Box" },
    { value: "accessoriesAvailable", label: "All Accessories" }
  ];

  const ageOptions = [
    { value: "", label: "Any Age" },
    { value: "0-1", label: "0-1 years" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5+", label: "5+ years" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategories, priceRange, selectedFeatures, ageRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");
      const response = await getAllProducts();
      console.log("Products response:", response);
      
      // Handle different response structures
      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.products && Array.isArray(response.products)) {
        productsData = response.products;
      }
      
      console.log("Processed products data:", productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      if (productsData.length === 0) {
        message.info("No products found. Be the first to list a product!");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      message.error("Failed to load products. Please try again.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
  
    // Dynamic search filter - FIXED
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Check if product has valid data
        const name = product.name || '';
        const description = product.description || '';
        const category = product.category || '';
        
        // Return true only if search term is found
        return name.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower) ||
               category.toLowerCase().includes(searchLower);
      });
    }
  
    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
  
    // Price range filter
    if (priceRange.min !== "" || priceRange.max !== "") {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0;
        const min = priceRange.min !== "" ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== "" ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }
  
    // Features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product => 
        selectedFeatures.every(feature => product[feature] === true)
      );
    }
  
    // Age range filter
    if (ageRange) {
      filtered = filtered.filter(product => {
        const age = parseInt(product.age) || 0;
        switch (ageRange) {
          case "0-1":
            return age >= 0 && age <= 1;
          case "1-3":
            return age > 1 && age <= 3;
          case "3-5":
            return age > 3 && age <= 5;
          case "5+":
            return age > 5;
          default:
            return true;
        }
      });
    }
  
    console.log('Applied filters:', {
      searchTerm,
      originalCount: products.length,
      filteredCount: filtered.length,
      sampleFiltered: filtered.slice(0, 3).map(p => p.name)
    });
  
    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSelectedFeatures([]);
    setAgeRange("");
    setFilteredProducts(products);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handleFeatureChange = (checkedValues) => {
    setSelectedFeatures(checkedValues);
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || "📦";
  };

  // Standardized product image placeholder - clean and consistent
  const getProductImagePlaceholder = (productName) => {
    return (
      <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center border-b">
        {/* Product Image Icon */}
        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-3">
          <svg 
            className="w-8 h-8 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        {/* Product Name */}
        <div className="text-sm text-gray-600 font-medium text-center px-3 leading-tight">
          {productName && productName.length > 25 ? 
            productName.substring(0, 25) + '...' : 
            productName || 'Product Image'}
        </div>
      </div>
    );
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          priceRange.min !== "" || 
                          priceRange.max !== "" || 
                          selectedFeatures.length > 0 || 
                          ageRange !== "" ||
                          searchTerm.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🛍️ Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing products from our community
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="shadow-sm sticky top-6" styles={{ body: { padding: '20px' } }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FilterOutlined className="mr-2" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button 
                    type="link" 
                    onClick={handleClearFilters}
                    className="text-red-500 hover:text-red-700 p-0"
                    icon={<ClearOutlined />}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <Search
                  placeholder="Search by name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="w-full"
                />
              </div>

              <Collapse 
                defaultActiveKey={['categories', 'price', 'features', 'age']} 
                ghost
                className="border-none"
              >
                {/* Categories */}
                <Panel header="Categories" key="categories">
                  <Checkbox.Group 
                    options={categories.map(cat => ({
                      label: `${cat.icon} ${cat.label}`,
                      value: cat.value
                    }))}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    className="flex flex-col space-y-2"
                  />
                </Panel>

                {/* Price Range */}
                <Panel header="Price Range" key="price">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min $"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        type="number"
                        min={0}
                      />
                      <Input
                        placeholder="Max $"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        type="number"
                        min={0}
                      />
                    </div>
                  </div>
                </Panel>

                {/* Product Features */}
                <Panel header="Product Features" key="features">
                  <Checkbox.Group 
                    options={features.map(feature => ({
                      label: feature.label,
                      value: feature.value
                    }))}
                    value={selectedFeatures}
                    onChange={handleFeatureChange}
                    className="flex flex-col space-y-2"
                  />
                </Panel>

                {/* Age Range */}
                <Panel header="Product Age" key="age">
                  <Select
                    value={ageRange}
                    onChange={setAgeRange}
                    placeholder="Select age range"
                    className="w-full"
                    allowClear
                  >
                    {ageOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Panel>
              </Collapse>

              {/* Results Count */}
              <div className="mt-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-indigo-800 text-sm font-medium">
                  📊 {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  {hasActiveFilters && ` (filtered from ${products.length})`}
                </p>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  // Safety check for product data
                  if (!product || !product._id) {
                    console.warn("Invalid product data:", product);
                    return null;
                  }
                  
                  return (
                    <Card
                      key={product._id}
                      hoverable
                      className="group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border"
                      onClick={() => navigate(`/product/${product._id}`)}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div className="relative">
                        {getProductImagePlaceholder(product.name)}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                            {getCategoryIcon(product.category)} {product.category || 'others'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                            {product.age || 0} {(product.age === 1) ? 'year' : 'years'} old
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                          {product.name || 'Unknown Product'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-2xl font-bold text-green-600">
                            ${(product.price || 0).toFixed(2)}
                          </span>
                          <div className="flex gap-1">
                            {product.billAvailable && <span title="Bill Available">📄</span>}
                            {product.warrantyAvailable && <span title="Warranty Available">🛡️</span>}
                            {product.boxAvailable && <span title="Original Box">📦</span>}
                            {product.accessoriesAvailable && <span title="All Accessories">🔌</span>}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            By {product.sellerId?.firstName || 'Unknown'}
                          </span>
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<ShoppingCartOutlined />}
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${product._id}`);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="space-y-2">
                      <span className="text-gray-500 text-lg">
                        {hasActiveFilters
                          ? "No products found matching your criteria"
                          : "No products available at the moment"}
                      </span>
                      {hasActiveFilters && (
                        <p className="text-gray-400 text-sm">
                          Try adjusting your filters or search terms
                        </p>
                      )}
                    </div>
                  }
                >
                  {hasActiveFilters && (
                    <Button 
                      type="primary" 
                      onClick={handleClearFilters}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </Empty>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;