import React from 'react';
// import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="original-price">{product.price.toLocaleString()} تومان</span>
              <span className="discounted-price">
                {(product.price * (100 - product.discount) / 100).toLocaleString()} تومان
              </span>
            </>
          ) : (
            <span>{product.price.toLocaleString()} تومان</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;