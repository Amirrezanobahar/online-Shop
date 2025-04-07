import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './Login.css'; // Create this CSS file
import Swal from 'sweetalert2';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری یا ایمیل الزامی است';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post('http://127.0.0.1:5000/user/login', {
          username: formData.username,
          password: formData.password
        });
  
        // Login successful
        localStorage.setItem('token', response.data.token);
        Swal.fire({
          icon: 'success',
          title: 'ورود موفقیت‌آمیز',
          text: 'به حساب کاربری خود خوش آمدید!',
          confirmButtonText: 'باشه'
        });
        navigate('/'); // Redirect to home page
      } catch (error) {
        if (error.response) {
          Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: error.response.status === 401 
              ? 'نام کاربری یا رمز عبور اشتباه است' 
              : 'خطای سرور. لطفا دوباره تلاش کنید',
            confirmButtonText: 'باشه'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'خطای شبکه',
            text: 'اتصال اینترنت را بررسی کنید',
            confirmButtonText: 'باشه'
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>ورود به حساب کاربری</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="username">
              <FaUser className="input-icon" />
              نام کاربری یا ایمیل
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="نام کاربری یا ایمیل خود را وارد کنید"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">
              <FaLock className="input-icon" />
              رمز عبور
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">مرا به خاطر بسپار</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="register-link">
          <span>حساب کاربری ندارید؟</span>
          <Link to="/register" className="register-btn">ثبت نام</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;