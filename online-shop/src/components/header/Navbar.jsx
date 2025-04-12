import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '../auth/logout/AuthContext'; // Changed to use AuthContext
import './Navbar.css';
import logo from '../../../logo/cover.png'

export default function Navbar() {
  const { userRole, isLoading, logout } = useAuth(); // Using auth context
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('آیا از خروج مطمئن هستید؟');
    if (confirmLogout) {
        try {
            await logout();
            navigate('/login'); // انتقال به صفحه ورود پس از خروج
        } catch (err) {
            console.error('خطا هنگام خروج:', err);
            alert('مشکلی در خروج رخ داد، لطفاً دوباره تلاش کنید.');
        }
    }
};

  if (isLoading) {
    return (
      <div className="navbar-loading">
        <div className="top-bar"></div>
        <div className="main-nav"></div>
      </div>
    );
  }

  return (
    <div className='navbar'>
      <div className='top-bar'>
        <p>ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</p>
      </div>

      <div className='main-nav'>
        <Link to='/' className='logo'>
          <img 
            src='https://www.digikala.com/brand/full-horizontal.svg' 
            alt='فروشگاه لوازم آرایشی' 
          />
        </Link>

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

        <div className='user-menu'>
          {userRole === 'ADMIN' ? (
            <Link to='/admin-panel' className='menu-item admin'>
              <LayoutDashboard size={24} />
              <span>پنل مدیریت</span>
            </Link>
          ) : (
            <Link to='/user-profile' className='menu-item'>
              <UserCircle size={24} />
              <span>پنل کاربری</span>
            </Link>
          )}

          <Link to='/cart' className='menu-item cart'>
            <ShoppingCart size={24} />
            <span className='badge'>۰</span>
            <span>سبد خرید</span>
          </Link>

          {!userRole ? (
            <Link to='/login' className='menu-item'>
              <User size={24} />
              <span>ورود | ثبت‌نام</span>
            </Link>
          ) : (
            <button className='menu-item' onClick={handleLogout}>
              <User size={24} />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

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