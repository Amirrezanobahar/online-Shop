<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> panel
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { format } from 'date-fns';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './EventSlider.css';
<<<<<<< HEAD

const EventSlider = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/event/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
=======
import axios from 'axios';

const EventSlider = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to Persian (Jalali) or beautiful Gregorian format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // For Gregorian dates (you can replace with Jalali if needed)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      calendar: 'persian' // Remove this line for Gregorian
    };
    
    return new Date(dateString).toLocaleDateString('fa-IR', options);
    
    // Alternative: Custom formatting
    // const date = new Date(dateString);
    // return `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/event/events');
        setEvents(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
>>>>>>> panel
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

<<<<<<< HEAD
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return dateString; // اگر تاریخ نامعتبر بود، مقدار اصلی را نمایش بده
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
=======
  if (loading) {
    return (
      <div className="events-slider-container loading">
        <div className="loading-spinner"></div>
        <p>در حال دریافت رویدادها...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-slider-container error">
        <div className="error-icon">⚠️</div>
        <p>خطا در دریافت اطلاعات: {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="events-slider-container empty">
        <div className="empty-icon">📅</div>
        <p>رویدادی برای نمایش وجود ندارد</p>
      </div>
    );
>>>>>>> panel
  }

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
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <div className="event-slide">
<<<<<<< HEAD
              <img
                src={`http://127.0.0.1:5000/public/uploads/events/${event.image}`}
                alt={event.title}
                className="slide-image"
              />
              <div className="slide-content">
                <h3>{event.title}</h3>
                <p>{formatDate(event.date)}</p>
                <button className="cta-button">View Details</button>
=======
              <div className="image-container">
                <img
                  src={`http://127.0.0.1:5000/public/uploads/events/${event.image}`}
                  alt={event.title}
                  className="slide-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-event.jpg';
                  }}
                />
                <div className="date-badge">
                  <span className="day">{formatDate(event.date).split(' ')[2]}</span>
                  <span className="month">{formatDate(event.date).split(' ')[1]}</span>
                </div>
              </div>
              <div className="slide-content">
                <div className="content-inner">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span className="calendar-icon">📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <p className="event-description">{event.description || 'توضیحات این رویداد'}</p>
                  <button className="cta-button">
                    مشاهده جزئیات
                    <span className="arrow-icon">→</span>
                  </button>
                </div>
>>>>>>> panel
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </Swiper>
    </div>
  );
};

export default EventSlider;