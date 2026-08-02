import axios from 'axios'

const envApiUrl = import.meta.env.VITE_API_URL?.trim()
const devHost = import.meta.env.DEV
  ? `http://${window.location.hostname}:3000`
  : 'https://ngls-backend.vercel.app'
const rawApiUrl = envApiUrl || devHost
export const API_URL = rawApiUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_URL,
})

export default api
