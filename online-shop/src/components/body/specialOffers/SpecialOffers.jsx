import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiShoppingCart, 
  FiHeart, 
  FiChevronRight, 
  FiChevronLeft, 
  FiRefreshCw 
} from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import './SpecialOffers.css';
import axios from 'axios';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const [specialProducts, setSpecialProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: '' 
  });

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch special offers
  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/product');
        setSpecialProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching special offers:', err);
      }
    };

    fetchSpecialProducts();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price * (100 - discount) / 100);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    
    try {
      // Validate product
      if (!product?._id || !product?.name || !product?.price) {
        showNotification('اطلاعات محصول ناقص است', 'error');
        return;
      }

      setAddingToCart(product._id);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare payload
      const payload = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || '/default-product.jpg',
        discount: product.discount || 0,
        stock: product.stock || 0,
        // Only include variants if they exist
        ...(product.sizes?.length > 0 && { size: product.sizes[0] }),
        ...(product.colors?.length > 0 && { color: product.colors[0] })
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
        // If cart doesn't exist (404), create one then retry
        if (error.response?.status === 404) {
          await axios.post(
            'http://127.0.0.1:5000/cart/create',
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
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
      console.error('Add to cart error:', error);
      showNotification(
        error.response?.data?.message || 
        'خطا در اضافه کردن به سبد خرید',
        'error'
      );
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className='special-offers-container'>
        <div className="loading-spinner">
          <FiRefreshCw className="spinner-icon" />
          در حال بارگذاری پیشنهادات ویژه...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='special-offers-container'>
        <div className="error-message">
          خطا در دریافت اطلاعات: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='special-offers-container'>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <section className="special-offers">
        <div className="offers-header">
          <h2>پیشنهادات شگفت‌انگیز</h2>
          <div className="countdown-timer">
            <FiClock className="timer-icon" />
            <span>زمان باقیمانده:</span>
            <span className="time">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="products-slider-container">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {specialProducts.map(product => (
              <SwiperSlide key={`product-${product._id}`}>
                <div className="product-card">
                  <div className="product-badge">
                    <span>{product.discount}% تخفیف</span>
                  </div>
                  
                  <div className="product-image" onClick={() => handleProductClick(product._id)}>
                    <img 
                      src={`http://127.0.0.1:5000/public${product.images?.[0]?.url}`} 
                      alt={product.name} 
                      loading="lazy" 
                    />
                    <div className="product-actions">
                      <button 
                        className="wishlist-btn" 
                        aria-label="افزودن به علاقه‌مندی‌ها"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiHeart />
                      </button>
                      <button 
                        className="quick-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product._id);
                        }}
                      >
                        نمایش سریع
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 onClick={() => handleProductClick(product._id)}>{product.name}</h3>
                    
                    <div className="price-section">
                      <span className="original-price">
                        {product.price.toLocaleString()} تومان
                      </span>
                      <span className="discounted-price">
                        {calculateDiscountedPrice(product.price, product.discount).toLocaleString()} تومان
                      </span>
                    </div>
                    
                    <div className="product-meta">
                      <div className="rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={`rating-${product._id}-${i}`}
                            className={`star ${i < Math.floor(product.rating?.average || 0) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                        <span>({product.rating?.average?.toFixed(1) || '۰.۰'})</span>
                      </div>
                      <div className="sold-count">
                        فروش: {(product.sold || 0).toLocaleString()} عدد
                      </div>
                    </div>
                    
                    <button 
                      className="add-to-cart" 
                      disabled={addingToCart === product._id}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      {addingToCart === product._id ? (
                        <span className="adding-spinner">
                          <FiRefreshCw className="spinner" /> در حال افزودن...
                        </span>
                      ) : (
                        <>
                          <FiShoppingCart />
                          افزودن به سبد خرید
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev">
            <FiChevronLeft />
          </div>
          <div className="swiper-button-next">
            <FiChevronRight />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialOffers;