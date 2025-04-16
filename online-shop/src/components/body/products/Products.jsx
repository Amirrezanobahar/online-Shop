import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingCart, FiStar, FiLoader, FiFilter, FiArrowDown, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    brands: [],
    priceRange: [0, 5000000],
    sort: 'newest',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [cartId, setCartId] = useState(null);

  const navigate = useNavigate();

  // ✅ تابع تبدیل آدرس تصویر
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default.jpg'; // عکس پیش‌فرض
    return `http://127.0.0.1:5000/public${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, catsRes, brandsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/product'),
          axios.get('http://127.0.0.1:5000/category'),
          axios.get('http://127.0.0.1:5000/brand'),
        ]);
        setProducts(productsRes.data);
        setCategories(catsRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkAndCreateCart();
  }, []);

  const checkAndCreateCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5000/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.cart) {
        setCartId(response.data.cart._id);
      } else {
        const createResponse = await axios.post(
          'http://127.0.0.1:5000/cart/create',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartId(createResponse.data.cart);
      }
    } catch (error) {
      console.error('Error checking/creating cart:', error);
    }
  };

  const handlePriceChange = (values) => {
    setFilters((prev) => ({ ...prev, priceRange: values }));
  };

  const handleBrandFilter = (brandId) => {
    setFilters((prev) => {
      const isSelected = prev.brands.includes(brandId);
      const updatedBrands = isSelected
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId];
      return { ...prev, brands: updatedBrands };
    });
  };

  const handleAddToCart = async (productId, quantity = 1, color = 'default', size = 'default') => {
    try {
      setAddingToCartId(productId);
      const token = localStorage.getItem('token');
      let currentCartId = cartId;

      if (!currentCartId) {
        const createRes = await axios.post(
          'http://127.0.0.1:5000/cart/create',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        currentCartId = createRes.data.cart;
        setCartId(currentCartId);
      }

      await axios.post(
        'http://127.0.0.1:5000/cart/addToCart',
        { productId, quantity, color, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ محصول با موفقیت به سبد خرید اضافه شد.');
    } catch (error) {
      console.error('❌ خطا در افزودن به سبد خرید:', error);
    } finally {
      setAddingToCartId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const finalPrice = product.price * (100 - (product.discount || 0)) / 100;
    return (
      (!filters.category || product.category?._id === filters.category) &&
      (filters.brands.length === 0 || filters.brands.includes(product.brand?._id)) &&
      finalPrice >= filters.priceRange[0] &&
      finalPrice <= filters.priceRange[1]
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.price * (100 - (a.discount || 0)) / 100;
    const bPrice = b.price * (100 - (b.discount || 0)) / 100;
    switch (filters.sort) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return (b.rating?.count || 0) - (a.rating?.count || 0);
      case 'price-low':
        return aPrice - bPrice;
      case 'price-high':
        return bPrice - aPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="products-container">
      {/* Sidebar Filters */}
      <aside className="products-filters">
        <div className="filter-section">
          <h4 className="filter-title"><FiFilter /> فیلترها</h4>

          {/* Categories */}
          <div className="filter-group">
            <h5>دسته‌بندی‌ها</h5>
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`filter-item ${filters.category === cat._id ? 'active' : ''}`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    category: prev.category === cat._id ? '' : cat._id,
                  }))
                }
              >
                {cat.name}
                <span className="category-count">({cat.productCount})</span>
              </div>
            ))}
          </div>

          {/* Brands */}
          <div className="filter-group">
            <h5>برندها</h5>
            {brands.map((brand) => (
              <label key={brand._id} className="brand-filter">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand._id)}
                  onChange={() => handleBrandFilter(brand._id)}
                />
                {brand.name}
                <span className="brand-count">({brand.productCount})</span>
              </label>
            ))}
          </div>

          {/* Price Slider */}
          <div className="filter-group">
            <h5>محدوده قیمت</h5>
            <div className="price-range-labels">
              <span>از {filters.priceRange[0].toLocaleString('fa-IR')} تومان</span>
              <span>تا {filters.priceRange[1].toLocaleString('fa-IR')} تومان</span>
            </div>
            <Slider
              range
              min={0}
              max={5000000}
              step={100000}
              value={filters.priceRange}
              onChange={handlePriceChange}
            />
          </div>
        </div>
      </aside>

      {/* Product Section */}
      <main className="products-main">
        <div className="products-header">
          <h2>محصولات</h2>
          <div className="products-controls">
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="newest">جدیدترین</option>
              <option value="popular">پرفروش‌ترین</option>
              <option value="price-low">ارزان‌ترین</option>
              <option value="price-high">گران‌ترین</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <FiLoader className="spinner" />
            <span>در حال بارگذاری...</span>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product) => {
              const finalPrice = product.price * (100 - (product.discount || 0)) / 100;

              return (
                <div className="product-card" key={product._id}>
                  <div className="product-image-container">
                    <img
                      src={getImageUrl(product.images?.[0]?.url)}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h5 className="product-name">{product.name}</h5>
                    <div className="product-rating">
                      <FiStar className="star" />
                      <span>{product.rating?.count || 0}</span>
                    </div>

                    <div className="product-price">
                      {product.discount > 0 && (
                        <div className="discounted-price">
                          <span>{product.price.toLocaleString('fa-IR')}</span>
                          <span className="currency">تومان</span>
                        </div>
                      )}
                      <div className="final-price">
                        <span>{finalPrice.toLocaleString('fa-IR')}</span>
                        <span className="currency">تومان</span>
                      </div>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      {addingToCartId === product._id ? (
                        <FiLoader className="spinner" />
                      ) : (
                        <>
                          <FiShoppingCart /> افزودن به سبد
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
