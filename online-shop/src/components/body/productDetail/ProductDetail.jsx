import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Carousel,
  Rate,
  Button,
  Divider,
  Tag,
  Space,
  Alert,
<<<<<<< HEAD
  Spin
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined
} from '@ant-design/icons';
=======
  Spin,
  message,
  Modal,
  Badge
} from 'antd';
import {   ShoppingCartOutlined, HeartOutlined, InfoCircleOutlined, CheckCircleTwoTone  } from '@ant-design/icons';
>>>>>>> panel
import './ProductDetail.css';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [carouselKey, setCarouselKey] = useState(0); // 👈 اضافه شد
=======
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [showServerInfo, setShowServerInfo] = useState(false);
  const [serverStatusLoading, setServerStatusLoading] = useState(false);
  const [cartSuccessModalVisible, setCartSuccessModalVisible] = useState(false);

>>>>>>> panel

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const { data } = await axios.get(`http://127.0.0.1:5000/product/${id}`);
        
        if (!data) throw new Error('محصول یافت نشد');
        setProduct(data);
<<<<<<< HEAD
        setCarouselKey(prev => prev + 1); // 👈 force re-render for Carousel
=======

        if (data.colors?.length > 0) setSelectedColor(data.colors[0]._id);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);

        // Fetch server info
        setServerStatusLoading(true);
        // const serverResponse = await axios.get('http://127.0.0.1:5000/server/status');
        // setServerInfo(serverResponse.data);
>>>>>>> panel
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'خطا در دریافت اطلاعات محصول'
        );
      } finally {
        setLoading(false);
        setServerStatusLoading(false);
      }
    };
<<<<<<< HEAD

    fetchProduct();
  }, [id]);

  const getImageUrl = (url) => {
    return `http://127.0.0.1:5000/public${url.startsWith('/') ? '' : '/'}${url}`;
  };
=======

    fetchData();
  }, [id]);
  const addToCart = async () => {
    if (!product) return;
  
    try {
      setCartLoading(true);
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate('/login');
        return;
      }
  
      const payload = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0]?.url || '/default-product.jpg',
        discount: product.discount || 0,
        ...(selectedColor && { color: selectedColor }),
        ...(selectedSize && { size: selectedSize }),
      };
  
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/cart/addToCart',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        message.success(response.data.message || 'محصول به سبد خرید اضافه شد');
        setCartSuccessModalVisible(true); // این خط را اضافه کنید
      } catch (error) {
        if (error.response?.status === 404) {
          await axios.post(
            'http://127.0.0.1:5000/cart/create',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          const retryResponse = await axios.post(
            'http://127.0.0.1:5000/cart/addToCart',
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          message.success(retryResponse.data.message || 'محصول به سبد خرید اضافه شد');
          setCartSuccessModalVisible(true);
        } else {
          throw error;
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
        'خطا در اضافه کردن به سبد خرید'
      );
    } finally {
      setCartLoading(false);
    }
  };

  const renderSection = (title, content) => {
    if (!content || (Array.isArray(content.props.children) && content.props.children.length === 0)) {
      return null;
    }

    return (
      <div className="section">
        <h3>{title}</h3>
        {content}
        <Divider />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="center-content">
        <Spin size="large" tip="در حال دریافت اطلاعات محصول..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-content">
        <Alert
          message="خطا"
          description={error}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 16 }}
        >
          بازگشت به صفحه اصلی
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="center-content">
        <Alert
          message="محصول یافت نشد"
          type="warning"
          showIcon
        />
      </div>
    );
  }
>>>>>>> panel

  if (loading) return <div className="loading-spinner"><Spin size="large" /></div>;
  if (error) return <Alert message={error} type="error" showIcon className="alert" />;
  if (!product) return <Alert message="محصول یافت نشد" type="warning" showIcon className="alert" />;

  return (
    <div className="product-detail">
<<<<<<< HEAD
      <div className="gallery-section">
        {product.images.length > 0 ? (
          <Carousel autoplay key={carouselKey}>
            {product.images.map((image, index) => (
              <div key={index} className="carousel-image-wrapper">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.altText || product.name}
                  className="carousel-image"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>تصویری برای این محصول ثبت نشده است.</div>
        )}
=======
      {/* Server Info Button */}
      <Button 
        type="text" 
        icon={<InfoCircleOutlined />} 
        onClick={() => setShowServerInfo(true)}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}
      />

      <div className="gallery">
        <Carousel autoplay>
          {product.images.map((image, index) => (
            <div key={index}>
              <img
                src={`http://127.0.0.1:5000/public${image.url}`}
                alt={image.altText || product.name}
                onError={(e) => {
                  e.target.src = '/default-product.jpg';
                }}
              />
            </div>
          ))}
        </Carousel>
>>>>>>> panel
      </div>

      <div className="info-section">
        <h1 className="product-title">{product.name}</h1>

        <div className="price-box">
          {product.discount > 0 && (
<<<<<<< HEAD
            <span className="price-original">
              {product.price.toLocaleString()} تومان
            </span>
          )}
          <span className="price-final">
            {(product.price * (100 - product.discount) / 100).toLocaleString()} تومان
          </span>
          {product.discount > 0 && (
            <Tag color="red">{product.discount}% تخفیف</Tag>
          )}
        </div>

        <div className="rating-box">
          <Rate allowHalf disabled defaultValue={product.rating.average || 0} />
          <span className="rating-count">({product.rating.count} نظر)</span>
        </div>

        <div className="meta-box">
          <Space size="middle" direction="vertical">
            <div><span className="label">برند:</span> {product.brand.name}</div>
            <div><span className="label">دسته‌بندی:</span> {product.category.name}</div>
            {product.stock > 0 ? (
              <Tag color="green">موجود در انبار</Tag>
            ) : (
              <Tag color="red">ناموجود</Tag>
            )}
          </Space>
        </div>

        <Divider />

        <div className="section">
          <h3>ویژگی‌ها</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
=======
            <span className="original-price">
              {product.price.toLocaleString()} تومان
            </span>
          )}
          <span className="final-price">
            {finalPrice} تومان
          </span>
          {product.discount > 0 && (
            <Tag color="red" className="discount-tag">
              {product.discount}% تخفیف
            </Tag>
          )}
        </div>

        <div className="rating-section">
          <Rate
            allowHalf
            defaultValue={product.rating?.average || 0}
            disabled
          />
          <span className="rating-count">
            ({product.rating?.count || 0} نظر)
          </span>
        </div>

        <Divider />

        <Space size="large" className="meta">
          {product.brand && (
            <span><strong>برند:</strong> {product.brand.name}</span>
          )}
          {product.category && (
            <span><strong>دسته‌بندی:</strong> {product.category.name}</span>
          )}
          {product.stock > 0 ? (
            <Tag color="green">موجود</Tag>
          ) : (
            <Tag color="red">ناموجود</Tag>
          )}
        </Space>

        <Divider />

        {product.colors.length > 0 && (
          <div className="color-selection">
            <h3>رنگ‌بندی</h3>
            <div className="color-options">
              {product.colors.map(color => (
                <div
                  key={color._id}
                  className={`color-option ${selectedColor === color._id ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color._id)}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
            </div>
            <Divider />
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="size-selection">
            <h3>اندازه</h3>
            <div className="size-options">
              {product.sizes.map(size => (
                <Button
                  key={size}
                  type={selectedSize === size ? 'primary' : 'default'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <Divider />
          </div>
        )}

        <div className="quantity-selector">
          <h3>تعداد</h3>
          <div className="quantity-controls">
            <Button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="quantity-value">{quantity}</span>
            <Button
              onClick={() => setQuantity(prev => Math.min(100, prev + 1))}
              disabled={quantity >= 100}
            >
              +
            </Button>
          </div>
          <Divider />
        </div>

        {renderSection('ویژگی‌ها', <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>)}
        {renderSection('توضیحات محصول', <p>{product.description}</p>)}
        {renderSection('مواد تشکیل‌دهنده', <ul>{product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>)}
        {renderSection('نحوه استفاده', <p>{product.howToUse}</p>)}
        {renderSection('هشدارها', <p>{product.warnings}</p>)}
>>>>>>> panel

        <Divider />

        <div className="section">
          <h3>توضیحات</h3>
          <p>{product.description}</p>
        </div>

        {product.colors.length > 0 && (
          <div className="section">
            <h3>رنگ‌بندی</h3>
            <div className="tags-row">
              {product.colors.map((color) => (
                <Tag key={color._id} color={color.hexCode}>
                  {color.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="section">
            <h3>اندازه‌ها</h3>
            <div className="tags-row">
              {product.sizes.map((size, i) => (
                <Tag key={i}>{size}</Tag>
              ))}
            </div>
          </div>
        )}

        {product.skinTypes.length > 0 && (
          <div className="section">
            <h3>نوع پوست مناسب</h3>
            <div className="tags-row">
              {product.skinTypes.map((skin, i) => (
                <Tag key={i}>{skin}</Tag>
              ))}
            </div>
          </div>
        )}

        {product.ingredients.length > 0 && (
          <div className="section">
            <h3>مواد تشکیل‌دهنده</h3>
            <ul>
              {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
        )}

        {product.howToUse && (
          <div className="section">
            <h3>نحوه استفاده</h3>
            <p>{product.howToUse}</p>
          </div>
        )}

        {product.warnings && (
          <div className="section">
            <h3>هشدارها</h3>
            <p>{product.warnings}</p>
          </div>
        )}

        <Divider />

        <div className="action-buttons">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={addToCart}
            loading={cartLoading}
            disabled={product.stock <= 0}
          >
            افزودن به سبد خرید
          </Button>
          <Button icon={<HeartOutlined />} size="large">
            افزودن به علاقه‌مندی‌ها
          </Button>
        </div>
      </div>

      {/* Server Info Modal */}
      <Modal
        title="اطلاعات سرور"
        visible={showServerInfo}
        onCancel={() => setShowServerInfo(false)}
        footer={null}
        width={600}
      >
        {serverStatusLoading ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Spin size="large" tip="در حال دریافت اطلاعات سرور..." />
          </div>
        ) : (
          <Alert
            message={
              <span style={{ fontSize: '16px' }}>
                وضعیت سیستم
                {serverInfo?.status === 'online' ? (
                  <Badge status="success" style={{ marginRight: '8px' }} />
                ) : (
                  <Badge status="error" style={{ marginRight: '8px' }} />
                )}
              </span>
            }
            description={
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <Tag color="blue" style={{ width: '120px', textAlign: 'center' }}>نام سرور</Tag>
                    <span>{serverInfo?.serverName || 'N/A'}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Tag color="geekblue" style={{ width: '120px', textAlign: 'center' }}>ورژن</Tag>
                    <span>{serverInfo?.version || 'N/A'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <Tag color="cyan" style={{ width: '120px', textAlign: 'center' }}>وضعیت</Tag>
                    <Tag color={serverInfo?.status === 'online' ? 'green' : 'red'}>
                      {serverInfo?.status === 'online' ? 'آنلاین' : 'آفلاین'}
                    </Tag>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Tag color="purple" style={{ width: '120px', textAlign: 'center' }}>پاسخ‌گویی</Tag>
                    <span>{serverInfo?.responseTime || 'N/A'} ms</span>
                  </div>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <Tag color="orange" style={{ width: '120px', textAlign: 'center' }}>آخرین بروزرسانی</Tag>
                    <span>{serverInfo?.lastUpdate ? new Date(serverInfo.lastUpdate).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            }
            type="info"
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}
      </Modal>
      <Modal
  open={cartSuccessModalVisible}
  onCancel={() => setCartSuccessModalVisible(false)}
  footer={null}
  centered
  width={500}
  className="custom-cart-modal"
>
  <div className="cart-success-modal-content">
    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
    <h2 style={{ margin: '16px 0 8px' }}>محصول به سبد خرید اضافه شد</h2>
    <p style={{ color: '#555' }}>{product.name}</p>

    <img
      src={`http://127.0.0.1:5000/public${product.images?.[0]?.url}`}
      alt={product.name}
      style={{ width: 120, height: 120, objectFit: 'contain', margin: '16px auto' }}
    />

    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
      <Button type="primary" onClick={() => navigate('/cart')} style={{ width: '48%' }}>
        مشاهده سبد خرید
      </Button>
      <Button onClick={() => setCartSuccessModalVisible(false)} style={{ width: '48%' }}>
        ادامه خرید
      </Button>
    </div>
  </div>
</Modal>

    </div>
  );
};

<<<<<<< HEAD
export default ProductDetail;
=======
export default ProductDetail;
>>>>>>> panel
