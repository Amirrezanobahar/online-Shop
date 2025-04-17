import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
  Table,
  Button,
  InputNumber,
  Divider,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Popconfirm,
  message,
  Radio,
  Empty,
  Spin,
  Badge,
  Typography
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  HeartOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState('normal');
  const [coupon, setCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:5000/cart');
        setCartItems(data.items);
        setSelectedItems(data.items.map(item => item._id));
      } catch (error) {
        message.error('خطا در دریافت سبد خرید');
      } finally {
=======
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
>>>>>>> panel
        setLoading(false);
      }
    };

<<<<<<< HEAD
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id, value) => {
    try {
      await axios.put(`http://127.0.0.1:5000/cart/${id}`, { quantity: value });
      setCartItems(prev =>
        prev.map(item =>
          item._id === id ? { ...item, quantity: value } : item
        )
      );
      message.success('تعداد محصول با موفقیت تغییر یافت');
    } catch (error) {
      message.error('خطا در تغییر تعداد محصول');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/cart/${id}`);
      setCartItems(prev => prev.filter(item => item._id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      message.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      message.error('خطا در حذف محصول');
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    
    try {
      setCouponLoading(true);
      const { data } = await axios.post('http://127.0.0.1:5000/cart/coupon', { code: coupon });
      setCouponDiscount(data.discount);
      message.success('کد تخفیف با موفقیت اعمال شد');
    } catch (error) {
      message.error(error.response?.data?.message || 'کد تخفیف نامعتبر است');
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const calculateSubtotal = () => {
    const selected = cartItems.filter(item => selectedItems.includes(item._id));
    return selected.reduce((total, item) => {
      const itemPrice = item.product.price * (100 - item.product.discount) / 100;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    const selected = cartItems.filter(item => selectedItems.includes(item._id));
    return selected.reduce((total, item) => {
      return total + (item.product.price * item.product.discount / 100) * item.quantity;
    }, 0);
  };

  const deliveryCost = deliveryMethod === 'express' ? 50000 : 25000;
  const totalBeforeCoupon = calculateSubtotal() + deliveryCost;
  const finalTotal = totalBeforeCoupon * (100 - couponDiscount) / 100;

  const columns = [
    {
      title: (
        <Radio
          checked={selectedItems.length === cartItems.length && cartItems.length > 0}
          onChange={(e) => setSelectedItems(e.target.checked ? cartItems.map(item => item._id) : [])}
        />
      ),
      dataIndex: 'select',
      key: 'select',
      render: (_, record) => (
        <Radio
          checked={selectedItems.includes(record._id)}
          onChange={(e) => 
            setSelectedItems(e.target.checked 
              ? [...selectedItems, record._id] 
              : selectedItems.filter(id => id !== record._id))
          }
        />
      ),
      width: 50
    },
    {
      title: 'محصول',
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <div className="product-info">
          <Link to={`/product/${record.product._id}`}>
            <img 
              src={`http://127.0.0.1:5000/public/${record.product.images[0]?.url}`} 
              alt={record.product.name} 
              className="product-image"
              onError={(e) => {
                e.target.src = '/default-product.jpg';
                e.target.onerror = null;
              }}
            />
          </Link>
          <div className="product-details">
            <Link to={`/product/${record.product._id}`} className="product-name">
              {record.product.name}
            </Link>
            <div className="product-seller">فروشنده: {record.seller || 'دیجی‌کالا'}</div>
            {record.color && <div className="product-color">رنگ: {record.color}</div>}
            {record.size && <div className="product-size">سایز: {record.size}</div>}
            <div className="product-warranty">{record.product.warranty || 'گارانتی 18 ماهه'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'تعداد',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.product.stock}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      )
    },
    {
      title: 'قیمت واحد',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        const finalPrice = record.product.price * (100 - record.product.discount) / 100;
        return (
          <div className="price-cell">
            {record.product.discount > 0 && (
              <div className="original-price">
                {record.product.price.toLocaleString('fa-IR')} تومان
              </div>
            )}
            <div className="final-price">
              {finalPrice.toLocaleString('fa-IR')} تومان
            </div>
          </div>
        );
      }
    },
    {
      title: 'قیمت کل',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => {
        const finalPrice = record.product.price * (100 - record.product.discount) / 100;
        return (
          <div className="total-price">
            {(finalPrice * record.quantity).toLocaleString('fa-IR')} تومان
          </div>
        );
      }
    },
    {
      title: 'عملیات',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<HeartOutlined />} 
            onClick={() => navigate(`/product/${record.product._id}`)}
          />
          <Popconfirm
            title="آیا از حذف این محصول اطمینان دارید؟"
            onConfirm={() => handleRemoveItem(record._id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>در حال دریافت سبد خرید...</Text>
=======
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
>>>>>>> panel
      </div>
    );
  }

<<<<<<< HEAD
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#1890ff' }} />}
          description={
            <Text type="secondary">سبد خرید شما خالی است</Text>
          }
        >
          <Link to="/">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              بازگشت به صفحه اصلی
            </Button>
          </Link>
        </Empty>
=======
  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">
          خطا در دریافت سبد خرید: {error}
        </div>
>>>>>>> panel
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="digikala-cart">
      <Title level={2} className="cart-title">
        <ShoppingCartOutlined /> سبد خرید شما
        <Badge 
          count={cartItems.length} 
          style={{ backgroundColor: '#1890ff', marginLeft: '10px' }} 
        />
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="cart-items-card" bodyStyle={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="_id"
              pagination={false}
              className="cart-table"
              locale={{
                emptyText: 'محصولی در سبد خرید وجود ندارد'
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="summary-card" title="خلاصه سفارش">
            <div className="summary-row">
              <Text>جمع کل ({selectedItems.length} کالا):</Text>
              <Text>{calculateSubtotal().toLocaleString('fa-IR')} تومان</Text>
            </div>
            
            <div className="summary-row discount-row">
              <Text>تخفیف محصولات:</Text>
              <Text type="success">-{calculateDiscount().toLocaleString('fa-IR')} تومان</Text>
            </div>
            
            <Divider className="summary-divider" />
            
            <div className="delivery-method">
              <Title level={5} style={{ marginBottom: '16px' }}>روش ارسال:</Title>
              <Radio.Group
                onChange={(e) => setDeliveryMethod(e.target.value)}
                value={deliveryMethod}
              >
                <Space direction="vertical">
                  <Radio value="normal">
                    <Text>پست پیشتاز</Text>
                    <Text type="secondary"> (۲-۳ روز کاری)</Text>
                    <Text strong> - ۲۵,۰۰۰ تومان</Text>
                  </Radio>
                  <Radio value="express">
                    <Text>پست سفارشی</Text>
                    <Text type="secondary"> (۱ روز کاری)</Text>
                    <Text strong> - ۵۰,۰۰۰ تومان</Text>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            
            <Divider className="summary-divider" />
            
            <div className="coupon-section">
              <Title level={5} style={{ marginBottom: '16px' }}>کد تخفیف:</Title>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  placeholder="کد تخفیف را وارد کنید"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={couponLoading}
                />
                <Button 
                  type="primary" 
                  onClick={handleApplyCoupon}
                  loading={couponLoading}
                >
                  اعمال
                </Button>
              </Space.Compact>
              {couponDiscount > 0 && (
                <Text type="success" style={{ marginTop: '8px' }}>
                  {couponDiscount}% تخفیف اعمال شد
                </Text>
              )}
            </div>
            
            <Divider className="summary-divider" />
            
            <div className="summary-row">
              <Text>هزینه ارسال:</Text>
              <Text>{deliveryCost.toLocaleString('fa-IR')} تومان</Text>
            </div>
            
            {couponDiscount > 0 && (
              <div className="summary-row discount-row">
                <Text>تخفیف کد تخفیف:</Text>
                <Text type="success">
                  -{(totalBeforeCoupon * couponDiscount / 100).toLocaleString('fa-IR')} تومان
                </Text>
              </div>
            )}
            
            <Divider className="summary-divider" />
            
            <div className="summary-row total-row">
              <Title level={4}>مبلغ قابل پرداخت:</Title>
              <Title level={4}>{finalTotal.toLocaleString('fa-IR')} تومان</Title>
            </div>
            
            <Button
              type="primary"
              block
              size="large"
              icon={<CreditCardOutlined />}
              className="checkout-button"
              disabled={selectedItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              ادامه فرآیند خرید
            </Button>
            
            <Button
              type="default"
              block
              size="large"
              icon={<RollbackOutlined />}
              style={{ marginTop: '16px' }}
              onClick={() => navigate('/')}
            >
              بازگشت به فروشگاه
            </Button>
            
            <div className="secure-payment">
              <img src="/images/secure-payment.png" alt="پرداخت امن" />
              <Text type="secondary">پرداخت سریع و امن</Text>
            </div>
          </Card>
        </Col>
      </Row>
=======
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
>>>>>>> panel
    </div>
  );
};

export default Cart;