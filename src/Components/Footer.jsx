import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer" dir="rtl">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <h3>مدرسة نجيب محفوظ الرسميه لغات</h3>
          <p>تعليم متميز، قيم ثابتة، ومستقبل أفضل لطلابنا.</p>
        </div>

        <div className="footer-section footer-links">
          <h4>روابط سريعة</h4>
          <nav>
            <Link to="/">الرئيسية</Link>
            <Link to="/ans">الأخبار</Link>
            <Link to="/videos">الفيديوهات</Link>
            <Link to="/login">تسجيل الدخول</Link>
          </nav>
        </div>

        <div className="footer-section footer-contact">
          <h4>تواصل معنا</h4>
          <p>الهاتف: 0123456789</p>
          <p>البريد: info@ngls.school</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 مدرسة نجيب محفوظ الرسميه لغات. جميع الحقوق محفوظة.</span>
      </div>
    </footer>
  )
}

export default Footer
