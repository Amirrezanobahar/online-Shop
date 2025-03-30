import React, { useState, useEffect } from 'react';
import { FiClock, FiShoppingCart, FiHeart, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './SpecialOffers.css';

const SpecialOffers = () => {
  // تایمر شمارش معکوس
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // لیست محصولات پیشنهادی
  const specialProducts = [
    {
      id: 1,
      name: "رژلب ماتی شماره 12",
      price: 180000,
      discount: 30,
      image: "https://dkstatics-public.digikala.com/digikala-products/6164b4d47a1f7b00c5d2709b3738cd08b572eba4_1741551778.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 65,
      rating: 4.8
    },
    {
      id: 2,
      name: "پالت چشم مایع 6 رنگ",
      price: 320000,
      discount: 25,
      image: "https://dkstatics-public.digikala.com/digikala-products/1ea4587f3b9fc2878e0471b9e04754108ef248fe_1738569472.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 42,
      rating: 4.9
    },
    {
      id: 3,
      name: "کرم پودر فول کاور",
      price: 250000,
      discount: 40,
      image: "https://dkstatics-public.digikala.com/digikala-products/6164b4d47a1f7b00c5d2709b3738cd08b572eba4_1741551778.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 78,
      rating: 4.7
    },
    {
      id: 4,
      name: "خط چشم مایع ضد آب",
      price: 120000,
      discount: 20,
      image: "https://dkstatics-public.digikala.com/digikala-products/6f7bab10c3ef2fc6c7caa9efdaf8253485ff6c25_1702583211.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 53,
      rating: 4.6
    },
    {
      id: 5,
      name: "ماسک صورت هیدراسیون",
      price: 95000,
      discount: 15,
      image: "https://dkstatics-public.digikala.com/digikala-products/1148645.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 120,
      rating: 4.5
    },
    {
      id: 3,
      name: "کرم پودر فول کاور",
      price: 250000,
      discount: 40,
      image: "https://dkstatics-public.digikala.com/digikala-products/6164b4d47a1f7b00c5d2709b3738cd08b572eba4_1741551778.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 78,
      rating: 4.7
    },
    {
      id: 4,
      name: "خط چشم مایع ضد آب",
      price: 120000,
      discount: 20,
      image: "https://dkstatics-public.digikala.com/digikala-products/6f7bab10c3ef2fc6c7caa9efdaf8253485ff6c25_1702583211.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 53,
      rating: 4.6
    },
    {
      id: 5,
      name: "ماسک صورت هیدراسیون",
      price: 95000,
      discount: 15,
      image: "https://dkstatics-public.digikala.com/digikala-products/1148645.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 120,
      rating: 4.5
    },
    {
      id: 6,
      name: "براش آرایشی 8 عددی",
      price: 210000,
      discount: 35,
      image: "https://dkstatics-public.digikala.com/digikala-products/1207460.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
      sold: 87,
      rating: 4.8
    }
  ];

  // محاسبه قیمت بعد از تخفیف
  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price * (100 - discount) / 100);
  };

  return (
    <div className='special-offers-container'>
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
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
        >
          {specialProducts.map(product => (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <div className="product-badge">
                  <span>{product.discount}% تخفیف</span>
                </div>
                
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-actions">
                    <button className="wishlist-btn">
                      <FiHeart />
                    </button>
                    <button className="quick-view">نمایش سریع</button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  
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
                          key={i} 
                          className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                        >
                          {i < product.rating ? '★' : '☆'}
                        </span>
                      ))}
                      <span>({product.rating})</span>
                    </div>
                    <div className="sold-count">
                      فروش: {product.sold} عدد
                    </div>
                  </div>
                  
                  <button className="add-to-cart">
                    <FiShoppingCart />
                    افزودن به سبد خرید
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