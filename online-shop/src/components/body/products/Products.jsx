import React, { useState } from 'react';
import { FiHeart, FiShoppingCart, FiStar, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  // آرایه محصولات نمونه
  const mockProducts = [
    {
      _id: '67f43502ab8c0e324f96805d',
      name: 'رژلب مایع مایبلین',
      brand: 'maybelline',
      category: 'lipstick',
      price: 120000,
      discount: 15,
      rating: 4.5,
      reviewsCount: 42,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0272285_balm.jpg.jpeg'],
      stock: 10,
      isNew: true
    },
    {
      _id: '2',
      name: 'خط چشم مایع لورآل',
      brand: 'loreal',
      category: 'eyeliner',
      price: 85000,
      discount: 0,
      rating: 4.2,
      reviewsCount: 35,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0285972_comeon-nail-polish-remover-246150041601.jpg.jpeg'],
      stock: 15,
      isNew: false
    },
    {
      _id: '3',
      name: 'کرم پودر روژلن',
      brand: 'revlon',
      category: 'foundation',
      price: 150000,
      discount: 20,
      rating: 4.7,
      reviewsCount: 28,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0214571_cerita-eyebrow-enhancer-214130011201.jpg.jpeg'],
      stock: 5,
      isNew: true
    },
    {
      _id: '4',
      name: 'رژلب مات لورآل',
      brand: 'loreal',
      category: 'lipstick',
      price: 95000,
      discount: 10,
      rating: 4.3,
      reviewsCount: 56,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0272627_no-brand-201281622508.jpg.jpeg '],
      stock: 0,
      isNew: false
    },
    {
      _id: '5',
      name: 'خط چشم مدادی مایبلین',
      brand: 'maybelline',
      category: 'eyeliner',
      price: 65000,
      discount: 0,
      rating: 4.0,
      reviewsCount: 39,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0193082_-.jpeg'],
      stock: 20,
      isNew: false
    },
    {
      _id: '1',
      name: 'رژلب مایع مایبلین',
      brand: 'maybelline',
      category: 'lipstick',
      price: 120000,
      discount: 15,
      rating: 4.5,
      reviewsCount: 42,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0377988_7010.jpeg   '],
      stock: 10,
      isNew: true
    },
    {
      _id: '2',
      name: 'خط چشم مایع لورآل',
      brand: 'loreal',
      category: 'eyeliner',
      price: 85000,
      discount: 0,
      rating: 4.2,
      reviewsCount: 35,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0287772_real-techniques-set-brush-pad-01786-201282012511.jpg.jpeg'],
      stock: 15,
      isNew: false
    },
    {
      _id: '3',
      name: 'کرم پودر روژلن',
      brand: 'revlon',
      category: 'foundation',
      price: 150000,
      discount: 20,
      rating: 4.7,
      reviewsCount: 28,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0369687_-.jpeg'],
      stock: 5,
      isNew: true
    },
    {
      _id: '4',
      name: 'رژلب مات لورآل',
      brand: 'loreal',
      category: 'lipstick',
      price: 95000,
      discount: 10,
      rating: 4.3,
      reviewsCount: 56,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0296739_saloni-17900000003.jpg.jpeg'],
      stock: 0,
      isNew: false
    },
    {
      _id: '5',
      name: 'خط چشم مدادی مایبلین',
      brand: 'maybelline',
      category: 'eyeliner',
      price: 65000,
      discount: 0,
      rating: 4.0,
      reviewsCount: 39,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0397875--15-.jpeg'],
      stock: 20,
      isNew: false
    },
    {
      _id: '6',
      name: 'کرم پودر مایبلین',
      brand: 'maybelline',
      category: 'foundation',
      price: 110000,
      discount: 5,
      rating: 4.4,
      reviewsCount: 47,
      images: ['https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0272291_comeon-lip-balm-strawberry-246200651401.jpg.jpeg'],
      stock: 8,
      isNew: true
    }
  ];

  const [products, setProducts] = useState(mockProducts);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 500000],
    brand: '',
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // فیلتر کردن محصولات بر اساس تنظیمات
  const filteredProducts = mockProducts.filter(product => {
    // فیلتر دسته‌بندی
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // فیلتر برند
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }
    
    // فیلتر محدوده قیمت
    const finalPrice = product.discount > 0 
      ? product.price * (100 - product.discount) / 100 
      : product.price;
      
    if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) {
      return false;
    }
    
    return true;
  });

  // مرتب‌سازی محصولات
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'popular':
        return b.rating - a.rating;
      case 'price-low':
        return (a.discount > 0 ? a.price * (100 - a.discount) / 100 : a.price) - 
               (b.discount > 0 ? b.price * (100 - b.discount) / 100 : b.price);
      case 'price-high':
        return (b.discount > 0 ? b.price * (100 - b.discount) / 100 : b.price) - 
               (a.discount > 0 ? a.price * (100 - a.discount) / 100 : a.price);
      default:
        return 0;
    }
  });

  const handleAddToCart = (productId) => {
    console.log('افزودن به سبد خرید:', productId);
    // منطق افزودن به سبد خرید
  };

  const handleAddToWishlist = (productId) => {
    console.log('افزودن به لیست علاقه‌مندی‌ها:', productId);
    // منطق افزودن به لیست علاقه‌مندی‌ها
  };

  const handleQuickView = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>محصولات آرایشی</h2>
        <div className="products-controls">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> فیلترها
          </button>
          <select 
            name="sort" 
            value={filters.sort}
            onChange={handleFilterChange}
            className="sort-select"
          >
            <option value="newest">جدیدترین</option>
            <option value="popular">پرفروش‌ترین</option>
            <option value="price-low">قیمت (کم به زیاد)</option>
            <option value="price-high">قیمت (زیاد به کم)</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="products-filters">
          <div className="filter-section">
            <h4>دسته‌بندی</h4>
            <select 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">همه دسته‌بندی‌ها</option>
              <option value="lipstick">رژلب</option>
              <option value="eyeliner">خط چشم</option>
              <option value="foundation">کرم پودر</option>
            </select>
          </div>
          
          <div className="filter-section">
            <h4>برند</h4>
            <select 
              name="brand" 
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">همه برندها</option>
              <option value="loreal">لورآل</option>
              <option value="maybelline">مایبلین</option>
              <option value="revlon">روژلن</option>
            </select>
          </div>
          
          <div className="filter-section">
            <h4>محدوده قیمت</h4>
            <div className="price-range">
              <input 
                type="range" 
                min="0" 
                max="500000" 
                step="50000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                }))}
              />
              <div className="price-values">
                <span>0 تومان</span>
                <span>{filters.priceRange[1].toLocaleString()} تومان</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="products-grid">
        {sortedProducts.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-badge">
              {product.discount > 0 && (
                <span className="discount-badge">{product.discount}% تخفیف</span>
              )}
              {product.isNew && <span className="new-badge">جدید</span>}
            </div>
            
            <div 
              className="product-image"
              onClick={() => handleQuickView(product._id)}
            >
              <img src={product.images[0]} alt={product.name} />
              <button 
                className="quick-view-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickView(product._id);
                }}
              >
                مشاهده سریع
              </button>
            </div>
            
            <div className="product-info">
              <h3 onClick={() => handleQuickView(product._id)}>{product.name}</h3>
              <div className="product-brand">{product.brand}</div>
              
              <div className="product-price">
                {product.discount > 0 ? (
                  <>
                    <span className="original-price">
                      {product.price.toLocaleString()} تومان
                    </span>
                    <span className="final-price">
                      {(
                        product.price * (100 - product.discount) / 100
                      ).toLocaleString()} تومان
                    </span>
                  </>
                ) : (
                  <span className="final-price">
                    {product.price.toLocaleString()} تومان
                  </span>
                )}
              </div>
              
              <div className="product-actions">
                <button 
                  className="wishlist-button"
                  onClick={() => handleAddToWishlist(product._id)}
                >
                  <FiHeart />
                </button>
                <button 
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <FiShoppingCart /> افزودن به سبد
                </button>
              </div>
              
              <div className="product-meta">
                <div className="product-rating">
                  <FiStar className="star-icon" />
                  <span>{product.rating}</span>
                  <span>({product.reviewsCount})</span>
                </div>
                {product.stock > 0 ? (
                  <div className="in-stock">موجود در انبار</div>
                ) : (
                  <div className="out-of-stock">ناموجود</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;