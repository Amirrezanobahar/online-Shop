import { useEffect, useState } from 'react';
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
  Spin
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined
} from '@ant-design/icons';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselKey, setCarouselKey] = useState(0); // 👈 اضافه شد

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:5000/product/${id}`);
        setProduct(data);
        setCarouselKey(prev => prev + 1); // 👈 force re-render for Carousel
      } catch (err) {
        setError(err.response?.data?.message || 'خطا در دریافت اطلاعات محصول');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (url) => {
    return `http://127.0.0.1:5000/public${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) return <div className="loading-spinner"><Spin size="large" /></div>;
  if (error) return <Alert message={error} type="error" showIcon className="alert" />;
  if (!product) return <Alert message="محصول یافت نشد" type="warning" showIcon className="alert" />;

  return (
    <div className="product-detail">
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
      </div>

      <div className="info-section">
        <h1 className="product-title">{product.name}</h1>

        <div className="price-box">
          {product.discount > 0 && (
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
            disabled={product.stock <= 0}
          >
            افزودن به سبد خرید
          </Button>
          <Button icon={<HeartOutlined />} size="large">
            افزودن به علاقه‌مندی‌ها
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
