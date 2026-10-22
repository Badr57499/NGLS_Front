import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/authcontext';
import './NavBar.css';

function NavBar({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'الرئيسيه' },
    { to: '/ans', label: 'الأخبار و التحديثات' },
    { to: '/videos', label: 'الفيديوهات' },
  ];

  return (
    <header className={`navbar-full ${className}`.trim()}>
      <div className="navbar-inner">
        <div className="navbar-brand">مدرسة نجيب محفوظ الرسميه لغات</div>

        {user && (
          <div className="navbar-account" aria-label="حساب المستخدم">
            <div className="account-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="account-details">
              <span className="account-label">حسابي</span>
              <span className="account-name">{user.username}</span>
              <span className="account-role">{user.role || 'عضو'}</span>
            </div>
          </div>
        )}
      </div>

      <nav className={`nav-links ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
            {item.label}
          </Link>
        ))}

        {user && (
          <button type="button" className="logout-button" onClick={logout}>
            تسجيل الخروج
          </button>
        )}
      </nav>

      <div className="drop-down-menu">
        <button type="button" className="menu-button" onClick={() => setIsOpen((prev) => !prev)}>
          المزيد
        </button>

        {isOpen && (
          <div className="dropdown-content">
            <Link to="/login" onClick={() => setIsOpen(false)}>تسجيل الدخول</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
