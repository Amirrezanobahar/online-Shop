import React, { useState, useEffect } from 'react';
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
        setLoading(false);
      }
    };

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
      </div>
    );
  }

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
      </div>
    );
  }

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
    </div>
  );
};

export default Cart;