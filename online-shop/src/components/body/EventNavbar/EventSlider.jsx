import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import { format } from 'date-fns';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './EventSlider.css';

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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return dateString; // اگر تاریخ نامعتبر بود، مقدار اصلی را نمایش بده
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
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
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <div className="event-slide">
              <img
                src={`http://127.0.0.1:5000/public/uploads/events/${event.image}`}
                alt={event.title}
                className="slide-image"
              />
              <div className="slide-content">
                <h3>{event.title}</h3>
                <p>{formatDate(event.date)}</p>
                <button className="cta-button">View Details</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSlider;