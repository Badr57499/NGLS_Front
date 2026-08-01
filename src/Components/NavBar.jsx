import { useState } from 'react';
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
                <a href="/">الرئيسيه</a>
                <a href="/ans">الأخبار و التحديثات</a>
                <a href="/videos">الفيديوهات</a>

                {user && (
                  <button className="logout-button" onClick={logout}>تسجيل الخروج</button>
                )}
            </div>
            <div className="drop-down-menu">
                <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>المزيد</button>
                {isOpen && 
                <div className='dropdown-content'>
                    <a href='/login'>تسجيل الدخول</a>
                </div>
                }
            </div>
        </div>
    );
}

export default NavBar