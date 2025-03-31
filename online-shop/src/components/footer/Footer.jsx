import React from 'react';
import { FaInstagram, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm '; // کامپوننت فرم خبرنامه
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-columns container">
          {/* ستون درباره ما */}
          <div className="footer-col">
            <h4 className="footer-title">فروشگاه آرایشی</h4>
            <p className="footer-about">
              ارائه بهترین محصولات آرایشی و بهداشتی با تضمین کیفیت و قیمت مناسب
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="social-link">
                <FaTelegram size={24} />
              </a>
              <a href="#" className="social-link">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="social-link">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* ستون لینک های سریع */}
          <div className="footer-col">
            <h4 className="footer-title">لینک های سریع</h4>
            <ul className="footer-links">
              <li><Link to="/about">درباره ما</Link></li>
              <li><Link to="/contact">تماس با ما</Link></li>
              <li><Link to="/faq">سوالات متداول</Link></li>
              <li><Link to="/blog">وبلاگ</Link></li>
              <li><Link to="/privacy">حریم خصوصی</Link></li>
            </ul>
          </div>

          {/* ستون اطلاعات تماس */}
          <div className="footer-col">
            <h4 className="footer-title">ارتباط با ما</h4>
            <ul className="contact-info">
              <li className="contact-item">
                <span>آدرس:</span>
                تهران، خیابان آزادی، پلاک ۱۲۳
              </li>
              <li className="contact-item">
                <span>تلفن:</span>
                <a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a>
              </li>
              <li className="contact-item">
                <span>ایمیل:</span>
                <a href="mailto:info@example.com">info@example.com</a>
              </li>
            </ul>
          </div>

          {/* ستون خبرنامه */}
          <div className="footer-col">
            <h4 className="footer-title">عضویت در خبرنامه</h4>
            <NewsletterForm />
            <p className="newsletter-note">
              با عضویت در خبرنامه از جدیدترین تخفیف‌ها مطلع شوید
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            © {new Date().getFullYear()} کلیه حقوق برای فروشگاه آرایشی محفوظ است
          </div>
          <div className="payment-methods">
            <img src="/images/payment/zarinpal.png" alt="زرین پال" />
            <img src="/images/payment/saman.png" alt="بانک سامان" />
            <img src="/images/payment/meli.png" alt="بانک ملی" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;