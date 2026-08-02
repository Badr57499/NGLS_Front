import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://ngls-backend.vercel.app')
export const API_URL = rawApiUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_URL,
})

export default api
