import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hf_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('hf_token')
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.user)
          localStorage.setItem('hf_user', JSON.stringify(res.data.user))
        })
        .catch(() => {
          localStorage.removeItem('hf_token')
          localStorage.removeItem('hf_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, token, user } = res.data
    localStorage.setItem('hf_token', accessToken || token)
    localStorage.setItem('hf_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload)
    const { accessToken, token, user } = res.data
    localStorage.setItem('hf_token', accessToken || token)
    localStorage.setItem('hf_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem('hf_token')
    localStorage.removeItem('hf_user')
    setUser(null)
    toast.success('Logged out')
  }

  const value = { user, setUser, login, register, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}