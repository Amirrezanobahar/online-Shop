import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingCart, FiStar, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000000],
    brand: '',
    sort: 'newest'
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, catsRes, brandsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/product'),
          axios.get('http://127.0.0.1:5000/category'),
          axios.get('http://127.0.0.1:5000/brand')
        ]);
        setProducts(productsRes.data);
        setCategories(catsRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('خطا در دریافت اطلاعات محصولات', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handlePriceChange = (values) => {
    setFilters(prev => ({ ...prev, priceRange: values }));
  };

  const handleAddToCart = async (product) => {
    try {
      // Validate product exists and has required fields
      if (!product || !product._id || !product.name || !product.price) {
        console.error('Invalid product:', product);
        showNotification('اطلاعات محصول ناقص است', 'error');
        return;
      }

      setAddingToCart(product._id);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      console.log({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || '/default-product.jpg',
        discount: product.discount || 0,});
      
      // Prepare complete payload with image
      const payload = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || '/default-product.jpg',
        discount: product.discount || 0,
        // Only include variants if they exist
        ...(product.colors?.length > 0 && { color: product.colors[0] }),
        ...(product.sizes?.length > 0 && { size: product.sizes[0] })
      };

      try {
        // First try to add to cart
        const response = await axios.post(
          'http://127.0.0.1:5000/cart/addToCart',
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        showNotification(response.data.message || 'محصول به سبد خرید اضافه شد', 'success');
      } catch (error) {
        if (error.response?.status === 404) {
          // Cart doesn't exist - create it first
          await axios.post(
            'http://127.0.0.1:5000/cart/create',
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
          );

          // Retry adding to cart
          const retryResponse = await axios.post(
            'http://127.0.0.1:5000/cart/addToCart',
            payload,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          showNotification(retryResponse.data.message || 'محصول به سبد خرید اضافه شد', 'success');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Add to cart error:', {
        error: error.message,
        response: error.response?.data
      });
      showNotification(
        error.response?.data?.message ||
        'خطا در اضافه کردن به سبد خرید',
        'error'
      );
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const finalPrice = product.price * (100 - (product.discount || 0)) / 100;
    return (
      (!filters.category || product.category?._id === filters.category) &&
      (!filters.brand || product.brand?._id === filters.brand) &&
      finalPrice >= filters.priceRange[0] &&
      finalPrice <= filters.priceRange[1]
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.price * (100 - (a.discount || 0)) / 100;
    const bPrice = b.price * (100 - (b.discount || 0)) / 100;

    switch (filters.sort) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular': return (b.rating?.count || 0) - (a.rating?.count || 0);
      case 'price-low': return aPrice - bPrice;
      case 'price-high': return bPrice - aPrice;
      default: return 0;
    }
  });

  const renderRating = (rating) => (
    <div className="product-rating">
      <FiStar className="star-icon" />
      <span>{rating?.average?.toFixed(1) || '۰.۰'}</span>
      <span>({rating?.count || 0})</span>
    </div>
  );

  return (
    <div className="products-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <aside className="products-filters">
        <div className="filter-box">
          <h4>دسته‌بندی</h4>
          <select
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <h4>برند</h4>
          <select
            value={filters.brand}
            onChange={e => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="">همه برندها</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <h4>محدوده قیمت (تومان)</h4>
          <Slider
            range
            min={0}
            max={5000000}
            step={100000}
            value={filters.priceRange}
            onChange={handlePriceChange}
            marks={{ 0: '۰', 2500000: '۲.۵ م', 5000000: '۵ م' }}
            tipFormatter={value => `${value.toLocaleString('fa-IR')} تومان`}
          />
          <div className="price-values">
            <span>{filters.priceRange[0].toLocaleString('fa-IR')} تومان</span>
            <span>{filters.priceRange[1].toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>
      </aside>

      <main className="products-main">
        <div className="products-header">
          <h2>محصولات</h2>
          <div className="products-controls">
            <select
              value={filters.sort}
              onChange={e => setFilters({ ...filters, sort: e.target.value })}
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
            {sortedProducts.length > 0 ? (
              sortedProducts.map(product => {
                const finalPrice = product.price * (100 - (product.discount || 0)) / 100;
                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img
                        src={`http://127.0.0.1:5000/public/${product.images?.[0]?.url}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      {product.discount > 0 && (
                        <span className="badge discount">{product.discount}% تخفیف</span>
                      )}
                      {product.isNew && <span className="badge new">جدید</span>}
                      <button
                        className="quick-view"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        مشاهده سریع
                      </button>
                    </div>

                    <div className="product-details">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-brand">{product.brand?.name}</p>

                      <div className="product-price">
                        {product.discount > 0 && (
                          <span className="old-price">
                            {product.price.toLocaleString('fa-IR')} تومان
                          </span>
                        )}
                        <span className="final-price">
                          {finalPrice.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="product-meta">
                        {renderRating(product.rating)}
                        <span className={`stock ${product.stock > 0 ? 'in' : 'out'}`}>
                          {product.stock > 0 ? 'موجود' : 'ناموجود'}
                        </span>
                      </div>

                      <div className="product-actions">
                        <button
                          className="add-to-cart"
                          disabled={product.stock <= 0 || addingToCart === product._id}
                          onClick={() => handleAddToCart(product)}
                        >
                          {addingToCart === product._id ? (
                            <>
                              <FiLoader className="spinner" /> در حال افزودن...
                            </>
                          ) : (
                            <>
                              <FiShoppingCart size={16} /> افزودن به سبد
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-products">
                <p>محصولی با فیلترهای انتخاب شده یافت نشد</p>
                <button
                  className="reset-filters"
                  onClick={() => setFilters({
                    category: '',
                    priceRange: [0, 5000000],
                    brand: '',
                    sort: 'newest'
                  })}
                >
                  بازنشانی فیلترها
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;