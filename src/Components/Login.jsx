import {useState} from 'react'
import axios from 'axios'
import './Login.css'
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../../Context/authcontext'

const API_URL = import.meta.env.VITE_API_URL === undefined ? 'http://localhost:3000' : import.meta.env.VITE_API_URL;

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const Navigate = useNavigate()
    const {setUser} = useAuth()
    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        try {
            const response = await axios.post(`https://ngls-backend.vercel.app/api/login` , {
                username,
                password
            })
            const token = response.data.token
            localStorage.setItem('token' , token)
            setSuccess(true)
            Navigate('/')
            setUser(response.data.user)
        } catch (err) {
            setError(true)
        }
    }
    return(
            <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">تسجيل الدخول</h1>
        <p className="register-subtitle">سجل للحصول على وصول سريع وآمن إلى حسابك.</p>

        <form className="register-form" onSubmit={handleLogin}>
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
         سجل الدخول
          </button>
          <p>ليس لديك حساب <a href="/register">انشأ حساب</a></p>

          {success && <p className="form-note">تم تسجيل الدخول بنجاح</p>}
          {error && <p className="form-error">لم نتمكن من تسجيل الدخول </p>}
        </form>
      </div>
    </div>
    )
}

export default Login
