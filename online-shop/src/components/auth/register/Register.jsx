import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css'; // Create this CSS file
import Swal from 'sweetalert2'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^09[0-9]{9}$/;

    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر وارد کنید';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمزهای عبور مطابقت ندارند';
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
        const response = await axios.post('http://127.0.0.1:5000/user/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });

        // Show success alert
        await Swal.fire({
          title: 'ثبت نام موفقیت‌آمیز بود!',
          text: 'حساب کاربری شما با موفقیت ایجاد شد',
          icon: 'success',
          confirmButtonText: 'ورود به حساب کاربری',
          confirmButtonColor: '#ef394e',
          timer: 5000
        });

        localStorage.setItem('token', response.data.token);
        navigate('/login');
      } catch (error) {
        let errorMessage = 'خطای سرور. لطفا دوباره تلاش کنید';
        
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage = 'ایمیل یا نام کاربری تکراری است';
          } else if (error.response.status === 422) {
            errorMessage = 'اطلاعات وارد شده معتبر نیست';
          }
        } else if (error.request) {
          errorMessage = 'خطای شبکه. اتصال اینترنت را بررسی کنید';
        }

        await Swal.fire({
          title: 'خطا در ثبت نام',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'متوجه شدم',
          confirmButtonColor: '#ef394e'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>ثبت نام در دیجی کالا</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="username">
              <FaUser className="input-icon" />
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="نام کاربری خود را وارد کنید"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
                placeholder="حداقل ۸ کاراکتر"
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

          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" />
              تکرار رمز عبور
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="رمز عبور را تکرار کنید"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>

        <div className="login-link">
          <span>قبلا ثبت نام کرده‌اید؟</span>
          <button onClick={() => navigate('/login')}>ورود به حساب کاربری</button>
        </div>
      </div>
    </div>
  );
};

export default Register;