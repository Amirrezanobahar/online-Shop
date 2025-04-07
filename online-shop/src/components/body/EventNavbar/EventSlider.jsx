import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './EventSlider.css'

const EventSlider = () => {
  const events = [
    {
      id: 1,
      title: "جشنواره تخفیف‌های بهاری",
      image: "https://dkstatics-public.digikala.com/digikala-adservice-banners/0f9b8b4829e8b12e503ff56b00cd2b14227d98db_1742741325.gif?x-oss-process=image?x-oss-process=image/format,webp",
      date: "۱۵ فروردین - ۳۰ اردیبهشت"
    },
    {
      id: 2,
      title: "کارگاه آرایش حرفه‌ای",
      image: "https://dkstatics-public.digikala.com/digikala-adservice-banners/8474ab06517c5a4930f32a8b7cbbf74781f83afb_1742435700.jpg?x-oss-process=image/quality,q_95/format,webp",
      date: "۵ خرداد ۱۴۰۳"
    },
    {
      id: 3,
      title: "معرفی محصولات جدید",
      image: "https://dkstatics-public.digikala.com/digikala-adservice-banners/1fedf7a69717f5dd53c6806feb63d3b2cc80b559_1742435784.jpg?x-oss-process=image/quality,q_95/format,webp",
      date: "۱۰ تیر ۱۴۰۳"
    }
  ];

  return (
    <div className="events-slider-container">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="event-slide">
              <img 
                src={event.image} 
                alt={event.title} 
                className="slide-image"
              />
              <div className="slide-content">
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <button className="cta-button">مشاهده جزئیات</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSlider;