import { useState } from 'react';
import api from '../../Context/api';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/api/register', {
        username,
        password,
      });
      setSuccess('تم إنشاء الحساب بنجاح');
      setUsername('');
      setPassword('');
    } catch (error) {
      setError('حدث خطأ أثناء التسجيل. حاول مرة أخرى.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">إنشاء حساب جديد</h1>
        <p className="register-subtitle">سجل للحصول على وصول سريع وآمن إلى حسابك.</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              id="username"
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ادخل اسم المستخدم"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ادخل كلمة المرور"
            />
          </div>

          <button className="register-button" type="submit">
            إنشاء حساب
          </button>
          <p>لديك حساب ؟ <Link to="/login">سجل الدخول</Link></p>

          {success && <p className="form-note">{success}</p>}
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
