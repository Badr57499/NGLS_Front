import { useState, useEffect } from 'react'
import axios from 'axios'
import './Annoucments.css'
import NavBar from './NavBar'

const API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_URL}/api/ancs`

function Annoucments() {
    const [announcements, setAnnouncements] = useState([])
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
    const [viewingAnnouncement, setViewingAnnouncement] = useState(null)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const authHeader = () => {
        const token = localStorage.getItem('token')
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    const isAdmin = () => {
        const raw = localStorage.getItem('token')
        const token = raw?.split('.')
        if (!token || token.length !== 3) return false
        try {
            const payload = JSON.parse(atob(token[1]))
            return payload.role === 'admin'
        } catch {
            return false
        }
    }

    const fetchAnnouncements = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(API_BASE, { headers: authHeader() })
            if (Array.isArray(res.data)) {
                setAnnouncements(res.data)
            } else {
                setError('استجابة الخادم غير صحيحة، يرجى التحقق من نقطة النهاية.')
                setAnnouncements([])
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            setAnnouncements([])
        } finally {
            setLoading(false)
        }
    }

    const clearForm = () => {
        setTitle('')
        setBody('')
        setImageFile(null)
        setImagePreview(null)
        setSelectedAnnouncement(null)
        setError(null)
        setSuccess(null)
    }

    const buildFormData = (payload, file) => {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value)
            }
        })
        if (file) {
            formData.append('image', file)
        }
        return formData
    }

    const submitAnnouncement = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!title.trim() || !body.trim()) {
            setError('يجب إدخال العنوان والمحتوى')
            return
        }

        const payload = { title, body }
        const formData = buildFormData(payload, imageFile)

        try {
            if (selectedAnnouncement) {
                await updateAnnouncement(selectedAnnouncement._id, formData)
            } else {
                await createAnnouncement(formData)
            }
            clearForm()
        } catch (err) {
            // Error state already set inside helper
        }
    }

    const createAnnouncement = async (payload) => {
        try {
            const res = await axios.post(API_BASE, payload, {
                headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            })
            setAnnouncements((prev) => [res.data, ...prev])
            setSuccess('تم إضافة الإعلان بنجاح')
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            throw err
        }
    }

    const updateAnnouncement = async (id, payload) => {
        try {
            const res = await axios.put(`${API_BASE}/${id}`, payload, {
                headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            })
            setAnnouncements((prev) => prev.map((item) => (item._id === id ? res.data : item)))
            setSuccess('تم تحديث الإعلان بنجاح')
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            throw err
        }
    }

    const deleteAnnouncement = async (id) => {
        setError(null)
        setSuccess(null)

        try {
            await axios.delete(`${API_BASE}/${id}`, {
                headers: authHeader()
            })
            setAnnouncements((prev) => prev.filter((item) => item._id !== id))
            setSuccess('تم حذف الإعلان بنجاح')
        } catch (err) {
            setError(err.response?.data?.message || err.message)
            throw err
        }
    }

    const startEditing = (announcement) => {
        setSelectedAnnouncement(announcement)
        setTitle(announcement.title)
        setBody(announcement.body)
        setError(null)
        setSuccess(null)
    }

    const openAnnouncementDetail = (announcement) => {
        setViewingAnnouncement(announcement)
    }

    const closeAnnouncementDetail = () => {
        setViewingAnnouncement(null)
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    return (
        <div className="announcements-page" dir="rtl">
            <NavBar className="announcements-navbar" />
            {isAdmin() && (
                <div className="announcements-form-card">
                    <h2>إدارة الإعلانات</h2>

                    {loading && <p className="info-message">جارٍ التحميل...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <form className="announcements-form" onSubmit={submitAnnouncement}>
                        <label htmlFor="announcement-title">العنوان</label>
                        <input
                            id="announcement-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="أدخل عنوان الإعلان"
                        />

                        <label htmlFor="announcement-body">المحتوى</label>
                        <textarea
                            id="announcement-body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="أدخل نص الإعلان"
                            rows={4}
                        />

                        <label htmlFor="announcement-image">صورة (اختياري)</label>
                        <input
                            id="announcement-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                setImageFile(file || null)
                                if (file) {
                                    setImagePreview(URL.createObjectURL(file))
                                } else {
                                    setImagePreview(null)
                                }
                            }}
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="معاينة" />
                            </div>
                        )}

                        <button type="submit">
                            {selectedAnnouncement ? 'تحديث الإعلان' : 'إضافة إعلان جديد'}
                        </button>

                        {selectedAnnouncement && (
                            <button type="button" onClick={clearForm} className="cancel-button">
                                إلغاء التعديل
                            </button>
                        )}
                    </form>
                </div>
            )}

            <div className="announcements-list-card">
                <h3>قائمة الإعلانات</h3>
                {!isAdmin() && (
                    <p className="info-message">عرض الإعلانات فقط. إضافة وتعديل وحذف الإعلانات متاح للمشرفين فقط.</p>
                )}

                {announcements.length === 0 && !loading ? (
                    <p>لا يوجد إعلانات حتى الآن.</p>
                ) : (
                    <ul className="announcements-list">
                        {announcements.map((item) => (
                            <li key={item._id} className="announcement-item" onClick={() => openAnnouncementDetail(item)}>
                                <div className="announcement-content">
                                    <h4>{item.title}</h4>
                                    <p className="announcement-preview">{item.body.substring(0, 100)}...</p>
                                    {item.image && (
                                        <div className="announcement-image">
                                            <img src={`${API_URL}/${item.image}`} alt={item.title} />
                                        </div>
                                    )}
                                </div>
                                {isAdmin() && (
                                    <div className="announcement-actions" onClick={(e) => e.stopPropagation()}>
                                        <button type="button" onClick={() => startEditing(item)}>
                                            تعديل
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm('هل تريد حذف هذا الإعلان؟')) {
                                                    deleteAnnouncement(item._id)
                                                }
                                            }}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {viewingAnnouncement && (
                <div className="announcement-modal-overlay" onClick={closeAnnouncementDetail}>
                    <div className="announcement-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="announcement-modal-close" onClick={closeAnnouncementDetail}>×</button>
                        <div className="announcement-modal-content">
                            <h2>{viewingAnnouncement.title}</h2>
                            {viewingAnnouncement.image && (
                                <div className="announcement-modal-image">
                                    <img src={`${API_URL}/${viewingAnnouncement.image}`} alt={viewingAnnouncement.title} />
                                </div>
                            )}
                            <p className="announcement-full-body">{viewingAnnouncement.body}</p>
                            <p className="announcement-date">
                                {new Date(viewingAnnouncement.createdAt).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Annoucments
