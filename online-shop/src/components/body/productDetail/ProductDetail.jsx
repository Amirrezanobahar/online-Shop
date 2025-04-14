import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Carousel,
  Rate,
  Button,
  Divider,
  Tag,
  Space,
  Alert,
  Spin,
  Tabs,
  Breadcrumb,
  Row,
  Col,
  Card,
  Badge,
  Collapse
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HomeOutlined,
  StarFilled,
  CheckOutlined,
  ShareAltOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import './ProductDetail.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:5000/product/${id}`);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]._id);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'خطا در دریافت اطلاعات محصول');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    // منطق افزودن به سبد خرید
    console.log({
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      quantity
    });
  };

  const handleAddToWishlist = () => {
    // منطق افزودن به لیست علاقه‌مندی‌ها
    console.log(product._id);
  };

  const getImageUrl = (image) => {
    if (!image) return '/default-product.jpg';
    if (image.url) return `http://127.0.0.1:5000/public${image.url}`;
    if (image.filename) return `http://127.0.0.1:5000/uploads/products/${image.filename}`;
    return '/default-product.jpg';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (loading) return (
    <div className="loading-container">
      <Spin size="large" />
    </div>
  );

  if (error) return (
    <div className="error-container">
      <Alert message={error} type="error" showIcon />
    </div>
  );

  if (!product) return (
    <div className="not-found-container">
      <Alert message="محصول یافت نشد" type="warning" showIcon />
    </div>
  );

  const finalPrice = product.price * (100 - product.discount) / 100;

  return (
    <div className="digikala-product-detail">
      {/* مسیر ناوبری */}
      <Breadcrumb className="product-breadcrumb">
        <Breadcrumb.Item href="/">
          <HomeOutlined /> خانه
        </Breadcrumb.Item>
        <Breadcrumb.Item href={`/category/${product.category?._id}`}>
          {product.category?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* گالری تصاویر */}
        <Col xs={24} md={12} lg={10}>
          <div className="product-gallery">
            <Carousel
              arrows
              prevArrow={<button type="button" className="custom-prev-arrow"><LeftOutlined /></button>}
              nextArrow={<button type="button" className="custom-next-arrow"><RightOutlined /></button>}
              dots={{ className: 'gallery-dots' }}
            >

              {product.images?.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={getImageUrl(image)}
                    alt={image.altText || product.name}
                    onError={(e) => {
                      e.target.src = '/default-product.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              ))}
            </Carousel>

            <div className="share-section">
              <Button icon={<ShareAltOutlined />} type="text">
                اشتراک گذاری
              </Button>
            </div>
          </div>
        </Col>

        {/* اطلاعات اصلی محصول */}
        <Col xs={24} md={12} lg={14}>
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <span className="brand">برند: {product.brand?.name}</span>
              <span className="category">دسته: {product.category?.name}</span>
              {product.stock > 0 ? (
                <Tag icon={<CheckOutlined />} color="success">موجود در انبار</Tag>
              ) : (
                <Tag color="error">ناموجود</Tag>
              )}
            </div>

            <div className="rating-section">
              <Rate
                allowHalf
                defaultValue={product.rating?.average || 0}
                character={<StarFilled />}
                disabled
              />
              <span className="rating-count">
                ({product.rating?.count || 0} نظر)
              </span>
            </div>

            <Divider className="custom-divider" />

            {/* قیمت */}
            <div className="price-section">
              {product.discount > 0 && (
                <div className="discount-badge">
                  <span>{product.discount}%</span>
                </div>
              )}
              <div className="price-container">
                {product.discount > 0 && (
                  <div className="original-price">
                    {formatPrice(product.price)}
                  </div>
                )}
                <div className="final-price">
                  {formatPrice(finalPrice)}
                </div>
              </div>
            </div>

            {/* انتخاب رنگ */}
            {product.colors?.length > 0 && (
              <div className="color-selector">
                <h4>رنگ:</h4>
                <Space size="middle">
                  {product.colors.map(color => (
                    <Button
                      key={color._id}
                      shape="circle"
                      style={{
                        backgroundColor: color.hexCode,
                        border: selectedColor === color._id ? '2px solid #1890ff' : '1px solid #ddd'
                      }}
                      onClick={() => setSelectedColor(color._id)}
                    />
                  ))}
                </Space>
              </div>
            )}

            {/* انتخاب سایز */}
            {product.sizes?.length > 0 && (
              <div className="size-selector">
                <h4>سایز:</h4>
                <Space size="small">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      type={selectedSize === size ? "primary" : "default"}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </Space>
              </div>
            )}

            {/* تعداد */}
            <div className="quantity-selector">
              <h4>تعداد:</h4>
              <div className="quantity-control">
                <Button onClick={decreaseQuantity}>-</Button>
                <span>{quantity}</span>
                <Button onClick={increaseQuantity}>+</Button>
              </div>
              <span className="stock-status">
                موجودی: {product.stock} عدد
              </span>
            </div>

            {/* دکمه‌های اقدام */}
            <div className="action-buttons">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                block
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                افزودن به سبد خرید
              </Button>
              <Button
                icon={<HeartOutlined />}
                size="large"
                block
                onClick={handleAddToWishlist}
              >
                افزودن به علاقه‌مندی‌ها
              </Button>
            </div>

            {/* اطلاعات سریع */}
            <Collapse bordered={false} className="quick-info">
              <Panel header="اطلاعات کلی محصول" key="1">
                <ul>
                  <li>برند: {product.brand?.name}</li>
                  <li>مدل: {product.model || '-'}</li>
                  <li>وزن: {product.weight?.value} {product.weight?.unit}</li>
                  <li>گارانتی: {product.warranty || 'ندارد'}</li>
                </ul>
              </Panel>
            </Collapse>
          </div>
        </Col>
      </Row>

      {/* تب‌های اطلاعات محصول */}
      <div className="product-tabs">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="نقد و بررسی" key="1">
            <div className="tab-content">
              {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
            </div>
          </TabPane>
          <TabPane tab="مشخصات فنی" key="2">
            <div className="specifications">
              {product.specifications?.length > 0 ? (
                <ul>
                  {product.specifications.map((spec, index) => (
                    <li key={index}>
                      <span className="spec-title">{spec.title}:</span>
                      <span className="spec-value">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                'مشخصات فنی برای این محصول ثبت نشده است.'
              )}
            </div>
          </TabPane>
          <TabPane tab="نظرات کاربران" key="3">
            <div className="reviews">
              {product.reviews?.length > 0 ? (
                product.reviews.map(review => (
                  <Card key={review._id} className="review-card">
                    <div className="review-header">
                      <Rate disabled defaultValue={review.rating} />
                      <span className="review-author">{review.author}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-content">
                      {review.comment}
                    </div>
                  </Card>
                ))
              ) : (
                'هنوز نظری برای این محصول ثبت نشده است.'
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;