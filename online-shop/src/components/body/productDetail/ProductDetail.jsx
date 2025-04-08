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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:5000/product/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'خطا در دریافت اطلاعات محصول');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Spin size="large" className="center-spinner" />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!product) return <Alert message="محصول یافت نشد" type="warning" showIcon />;

  return (
    <div className="product-detail-container">
      <div className="product-gallery">
        <Carousel autoplay>
          {product.images.map((image, index) => (
            <div key={index}>
              <img
                src='https://pics.mootanroo.com/insecure/size:384:0/quality:90/plain/https://api.mootanroo.com/images/thumbs/0272285_balm.jpg.jpeg'
                alt={image.altText || product.name}
                className="product-image"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        
        <div className="price-section">
          {product.discount > 0 && (
            <span className="original-price">
              {product.price.toLocaleString()} تومان
            </span>
          )}
          <span className="final-price">
            {(product.price * (100 - product.discount) / 100).toLocaleString()} تومان
          </span>
          {product.discount > 0 && (
            <Tag color="red" className="discount-tag">
              {product.discount}% تخفیف
            </Tag>
          )}
        </div>

        <Rate
          allowHalf
          defaultValue={product.rating.average || 0}
          disabled
          className="product-rating"
        />
        <span className="rating-count">({product.rating.count || 0} نظر)</span>

        <Divider />

        <div className="product-meta">
          <Space size="large">
            <div>
              <span className="meta-label">برند:</span>
              <span>{product.brand.name}</span>
            </div>
            <div>
              <span className="meta-label">دسته‌بندی:</span>
              <span>{product.category.name}</span>
            </div>
            {product.stock > 0 ? (
              <Tag color="green">موجود در انبار</Tag>
            ) : (
              <Tag color="red">ناموجود</Tag>
            )}
          </Space>
        </div>

        <Divider />

        <h3>ویژگی‌ها</h3>
        <ul className="features-list">
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <Divider />

        <h3>توضیحات محصول</h3>
        <p className="product-description">{product.description}</p>

        <Divider />

        <h3>رنگ‌بندی</h3>
        <div className="product-colors">
          {product.colors.map((color) => (
            <Tag key={color._id} color={color.hexCode}>
              {color.name}
            </Tag>
          ))}
        </div>

        <Divider />

        <h3>اندازه‌ها</h3>
        <div className="product-sizes">
          {product.sizes.map((size, index) => (
            <Tag key={index}>{size}</Tag>
          ))}
        </div>

        <Divider />

        <h3>نوع پوست مناسب</h3>
        <div className="skin-types">
          {product.skinTypes.map((skinType, index) => (
            <Tag key={index}>{skinType}</Tag>
          ))}
        </div>

        <Divider />

        <h3>مواد تشکیل‌دهنده</h3>
        <ul className="ingredients-list">
          {product.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <Divider />

        <h3>نحوه استفاده</h3>
        <p>{product.howToUse}</p>

        <Divider />

        <h3>هشدارها</h3>
        <p>{product.warnings}</p>

        <div className="product-actions">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            disabled={product.stock <= 0}
          >
            افزودن به سبد خرید
          </Button>
          <Button
            icon={<HeartOutlined />}
            size="large"
            className="wishlist-btn"
          >
            افزودن به علاقه‌مندی‌ها
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
