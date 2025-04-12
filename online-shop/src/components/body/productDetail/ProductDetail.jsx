import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel, Rate, Button, Divider, Tag, Space, Alert, Spin } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import './ProductDetail.css';

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

  if (loading) return <div className="center-content"><Spin size="large" /></div>;
  if (error) return <div className="center-content"><Alert message={error} type="error" showIcon /></div>;
  if (!product) return <div className="center-content"><Alert message="محصول یافت نشد" type="warning" showIcon /></div>;

  const finalPrice = (product.price * (100 - product.discount) / 100).toLocaleString();

  return (
    <div className="product-detail">
      <div className="gallery">
        <Carousel autoplay>
          {product.images.map((image, index) => (
            <div key={index}>
              <img src={`http://127.0.0.1:5000/public/uploads/products/1dea1143-08cc-465d-b687-564ed1a2fa23.jpg`} alt={image.altText || product.name} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="info">
        <h1 className="product-title">{product.name}</h1>

        <div className="price-section">
          {product.discount > 0 && (
            <span className="original-price">{product.price.toLocaleString()} تومان</span>
          )}
          <span className="final-price">{finalPrice} تومان</span>
          {product.discount > 0 && (
            <Tag color="red" className="discount-tag">{product.discount}% تخفیف</Tag>
          )}
        </div>

        <div className="rating-section">
          <Rate allowHalf defaultValue={product.rating.average} disabled />
          <span className="rating-count">({product.rating.count} نظر)</span>
        </div>

        <Divider />

        <Space size="large" className="meta">
          <span><strong>برند:</strong> {product.brand.name}</span>
          <span><strong>دسته‌بندی:</strong> {product.category.name}</span>
          {product.stock > 0 ? (
            <Tag color="green">موجود</Tag>
          ) : (
            <Tag color="red">ناموجود</Tag>
          )}
        </Space>

        <Divider />

        {renderSection('ویژگی‌ها', <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>)}
        {renderSection('توضیحات محصول', <p>{product.description}</p>)}
        {renderTagsSection('رنگ‌بندی', product.colors, color => (
          <Tag color={color.hexCode} key={color._id}>{color.name}</Tag>
        ))}
        {renderTagsSection('اندازه‌ها', product.sizes)}
        {renderTagsSection('نوع پوست مناسب', product.skinTypes)}
        {renderSection('مواد تشکیل‌دهنده', <ul>{product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>)}
        {renderSection('نحوه استفاده', <p>{product.howToUse}</p>)}
        {renderSection('هشدارها', <p>{product.warnings}</p>)}

        <div className="actions">
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

const renderSection = (title, content) => (
  <>
    <h3>{title}</h3>
    {content}
    <Divider />
  </>
);

const renderTagsSection = (title, items, renderItem = (item, index) => (
  <Tag key={index}>{item}</Tag>
)) => (
  items.length > 0 && renderSection(title, <div className="tag-container">{items.map(renderItem)}</div>)
);

export default ProductDetail;
