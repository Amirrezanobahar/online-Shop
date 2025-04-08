import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, LayoutDashboard, UserCircle } from 'lucide-react';
import { GetUserRole } from './../auth/panel/GetUserRole ';
import './Navbar.css';

export default function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await GetUserRole();
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="navbar-loading">
        {/* Placeholder while loading */}
        <div className="top-bar"></div>
        <div className="main-nav"></div>
      </div>
    );
  }

  return (
    <div className='navbar'>
      {/* نوار اطلاع رسانی */}
      <div className='top-bar'>
        <p>ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</p>
      </div>

      {/* بخش اصلی نوار ناوبری */}
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
          {/* نمایش پنل کاربری یا مدیریت بر اساس نقش */}
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

          {/* آیتم سبد خرید */}
          <Link to='/cart' className='menu-item cart'>
            <ShoppingCart size={24} />
            <span className='badge'>۰</span>
            <span>سبد خرید</span>
          </Link>

          {/* آیتم ورود/خروج */}
          {!userRole ? (
            <Link to='/login' className='menu-item'>
              <User size={24} />
              <span>ورود | ثبت‌نام</span>
            </Link>
          ) : (
            <Link to='/logout' className='menu-item'>
              <User size={24} />
              <span>خروج</span>
            </Link>
          )}
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