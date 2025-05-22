import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Checkbox, Spin, message } from "antd";
import { getAllProducts } from "../../apicalls/products";
import iiit_logo from "../../assets/iiit_logo.png";

const { Search } = Input;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);

      const uniqueCategories = [...new Set(data.map((product) => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      message.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (search, categories) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts(searchQuery, selectedCategories);
  }, [searchQuery, selectedCategories, products]);

  return (
    <div className="container mx-auto py-6 flex gap-6">
      {/* Sidebar Filters */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-lg font-bold mb-2">Filters</h2>
        <h3 className="font-semibold mb-2">Categories</h3>
        <Checkbox.Group
          options={categories}
          onChange={setSelectedCategories}
          className="flex flex-col gap-1 mb-4"
        />
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        {/* Search Bar */}
        <Search
          placeholder="Search Products here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          className="mb-4 w-full"
        />

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={iiit_logo}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.age} years old</p>
                  <p className="text-green-600 font-bold">${product.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
