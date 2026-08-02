import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/authcontext';
import './NavBar.css';

function NavBar({ className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <div className={`navbar-full ${className}`.trim()}>
            <div className="navbar">
                <div className="navbar-logo">مدرسة نجيب محفوظ الرسميه لغات</div>
                {user && (
                    <div className="navbar-account">
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

            <div className="nav-links">
                <Link to="/">الرئيسيه</Link>
                <Link to="/ans">الأخبار و التحديثات</Link>
                <Link to="/videos">الفيديوهات</Link>

                {user && (
                  <button className="logout-button" onClick={logout}>تسجيل الخروج</button>
                )}
            </div>
            <div className="drop-down-menu">
                <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>المزيد</button>
                {isOpen && 
                <div className='dropdown-content'>
                    <Link to='/login'>تسجيل الدخول</Link>
                </div>
                }
            </div>
        </div>
    );
}

export default NavBar