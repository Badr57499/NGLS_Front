import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/authcontext';
import NavBar from './NavBar';
import './Videos.css';

const API_URL = import.meta.env.VITE_API_URL === undefined ? 'http://localhost:3000' : import.meta.env.VITE_API_URL;
const API_BASE = `https://ngls-backend.vercel.app//api/videos`;

function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const isUploader = user?.role === 'admin' || user?.role === 'editor';

  const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setVideos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setSuccess(null);
    setError(null);
  };

  const submitVideo = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!title.trim() || !url.trim()) {
      setError('يجب إدخال العنوان ورابط اليوتيوب');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        API_BASE,
        { title, description, url },
        { headers: { ...authHeader(), 'Content-Type': 'application/json' } }
      );
      setVideos((prev) => [res.data, ...prev]);
      setSuccess('تم إضافة الفيديو بنجاح');
      clearForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="videos-page" dir="rtl">
      <NavBar className="videos-navbar" />

      <div className="videos-header-card">
        <h2>قسم الفيديوهات</h2>
        <p>يمكن للمشاهدين مشاهدة محتوى الفيديو من الرابط، ويستطيع المشرفون والمحررون إضافة روابط يوتيوب.</p>
      </div>

      {isUploader && (
        <div className="videos-form-card">
          <div className="videos-form-header">
            <h3>أضف فيديو جديد</h3>
            <span>متاح للمشرفين والمحررين فقط</span>
          </div>

          {loading && <p className="info-message">جارٍ التحميل...</p>}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form className="videos-form" onSubmit={submitVideo}>
            <label htmlFor="video-title">العنوان</label>
            <input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الفيديو"
            />

            <label htmlFor="video-description">الوصف</label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصفًا قصيرًا للفيديو (اختياري)"
              rows={3}
            />

            <label htmlFor="video-url">رابط YouTube</label>
            <input
              id="video-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <button type="submit">أضف الفيديو</button>
          </form>
        </div>
      )}

      <div className="videos-list-card">
        <h3>فيديوهات للمشاهدة</h3>
        <p className="videos-subtitle">شاهد المحتوى التعليمي مباشرة داخل الموقع.</p>

        {videos.length === 0 && !loading ? (
          <p className="info-message">لا يوجد فيديوهات بعد.</p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video._id} className="video-card">
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-details">
                  <h4>{video.title}</h4>
                  {video.description && <p>{video.description}</p>}
                  <span>أضيف بواسطة {video.createdByRole || 'عضو'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;
