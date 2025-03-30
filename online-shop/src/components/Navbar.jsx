import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import './Navbar.css'; // فایل CSS جداگانه

export default function Navbar() {
  return (
    <div className='navbar'>
      {/* نوار اطلاع رسانی */}
      <div className='top-bar'>
        <p>ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</p>
      </div>

      {/* بخش اصلی نوار导航 */}
      <div className='main-nav'>
        {/* لوگو */}
        <Link to='/' className='logo'>
          <img 
            src='https://www.digikala.com/brand/full-horizontal.svg' 
            alt='فروشگاه لوازم آرایشی' 
          />
        </Link>

        {/* جستجو */}
        <div className='search-box'>
          <div className='search-container'>
            <input
              type='text'
              placeholder='جستجوی محصولات...'
            />
            <button className='search-button'>
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* منوی کاربر */}
        <div className='user-menu'>
          {/* آیتم ورود */}
          <Link to='/login' className='menu-item'>
            <User size={24} />
            <span>ورود | ثبت‌نام</span>
          </Link>

          {/* آیتم سبد خرید */}
          <Link to='/cart' className='menu-item cart'>
            <ShoppingCart size={24} />
            <span className='badge'>۰</span>
            <span>سبد خرید</span>
          </Link>
        </div>
      </div>

      {/* منوی دسته‌بندی‌ها */}
      <div className='category-nav'>
        <button className='categories-btn'>
          <span>دسته‌بندی‌ها</span>
          <ChevronDown size={16} />
        </button>
        <nav className='nav-links'>
          <Link to='/offers'>پیشنهادات ویژه</Link>
          <Link to='/new'>محصولات جدید</Link>
          <Link to='/blog'>مجله آرایشی</Link>
        </nav>
      </div>
    </div>
  );
}