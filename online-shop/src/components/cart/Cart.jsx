import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:5000/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          // Cart doesn't exist, create empty cart
          setCart({ items: [], totalPrice: 0, totalItems: 0 });
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://127.0.0.1:5000/cart/update/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setCart(response.data);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://127.0.0.1:5000/cart/remove/${itemId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setCart(response.data);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:5000/cart/apply-coupon',
        { couponCode: coupon },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setDiscount(response.data.discount);
      setCouponMessage(response.data.message);
      setCouponError(false);
      setCart(prev => ({
        ...prev,
        totalPrice: prev.totalPrice - (prev.totalPrice * response.data.discount / 100)
      }));
    } catch (err) {
      setCouponMessage(err.response?.data?.message || 'کد تخفیف نامعتبر است');
      setCouponError(true);
      setDiscount(0);
    }
  };

  const calculateTotal = () => {
    if (!cart) return { subtotal: 0, discountedTotal: 0, discountAmount: 0 };
    
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const discountAmount = subtotal * discount / 100;
    const discountedTotal = subtotal - discountAmount;
    
    return {
      subtotal,
      discountedTotal,
      discountAmount
    };
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">
          <FiShoppingCart className="spinner-icon" />
          در حال بارگذاری سبد خرید...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">
          خطا در دریافت سبد خرید: {error}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <FiShoppingCart className="empty-cart-icon" />
          <h2>سبد خرید شما خالی است</h2>
          <p>می‌توانید برای مشاهده محصولات به صفحه اصلی بروید</p>
          <button 
            className="browse-products-btn"
            onClick={() => navigate('/')}
          >
            مشاهده محصولات
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        <FiShoppingCart className="cart-icon" />
        سبد خرید شما ({cart.totalItems} عدد)
      </h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={`http://127.0.0.1:5000/public${item.image}`} 
                  alt={item.name} 
                  onError={(e) => {
                    e.target.src = '/default-product.jpg';
                  }}
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                
                {item.color && (
                  <div className="item-variant">
                    <span>رنگ:</span>
                    <span className="variant-value">{item.color}</span>
                  </div>
                )}
                
                {item.size && (
                  <div className="item-variant">
                    <span>سایز:</span>
                    <span className="variant-value">{item.size}</span>
                  </div>
                )}
                
                <div className="item-price">
                  {item.discount > 0 ? (
                    <>
                      <span className="original-price">
                        {(item.price * item.quantity).toLocaleString()} تومان
                      </span>
                      <span className="discounted-price">
                        {Math.round(item.price * (100 - item.discount) / 100 * item.quantity).toLocaleString()} تومان
                      </span>
                    </>
                  ) : (
                    <span>{(item.price * item.quantity).toLocaleString()} تومان</span>
                  )}
                </div>
              </div>
              
              <div className="item-actions">
                <div className="quantity-control">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>
                
                <button 
                  className="remove-item"
                  onClick={() => removeItem(item._id)}
                >
                  <FiTrash2 />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>خلاصه سفارش</h3>
          
          <div className="summary-row">
            <span>جمع کل:</span>
            <span>{totals.subtotal.toLocaleString()} تومان</span>
          </div>
          
          {discount > 0 && (
            <div className="summary-row discount-row">
              <span>تخفیف ({discount}%):</span>
              <span>-{totals.discountAmount.toLocaleString()} تومان</span>
            </div>
          )}
          
          <div className="coupon-section">
            <input
              type="text"
              placeholder="کد تخفیف"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={applyCoupon}>اعمال کد</button>
          </div>
          
          {couponMessage && (
            <div className={`coupon-message ${couponError ? 'error' : 'success'}`}>
              {couponMessage}
            </div>
          )}
          
          <div className="summary-row total-row">
            <span>مبلغ قابل پرداخت:</span>
            <span>{totals.discountedTotal.toLocaleString()} تومان</span>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={proceedToCheckout}
          >
            پرداخت و تکمیل سفارش
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;