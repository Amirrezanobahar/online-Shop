// src/components/dashboard/UserDashboard.jsx
import { Outlet, Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/dashboard">پروفایل</Link></li>
            <li><Link to="/dashboard/orders">سفارشات</Link></li>
            <li><Link to="/dashboard/addresses">آدرس‌ها</Link></li>
            <li><Link to="/dashboard/wishlist">علاقه‌مندی‌ها</Link></li>
            <li><Link to="/dashboard/settings">تنظیمات</Link></li>
          </ul>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        <Outlet /> {/* نمایش زیرصفحات */}
      </main>
    </div>
  );
};