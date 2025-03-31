import React, { useState } from 'react';
import axios from 'axios';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/newsletter', { email });
      setMessage('عضویت شما با موفقیت انجام شد!');
      setEmail('');
    } catch (err) {
      setMessage('خطایی رخ داد. لطفا مجددا تلاش کنید.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="آدرس ایمیل خود را وارد کنید"
        required
      />
      <button type="submit">عضویت</button>
      {message && <div className="newsletter-message">{message}</div>}
    </form>
  );
};

export default NewsletterForm;