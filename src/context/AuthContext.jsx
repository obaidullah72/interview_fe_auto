import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const userData = await authApi.getProfile(token)
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password)
      setToken(data.tokens.access)
      setUser(data.user)
      localStorage.setItem('token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData)
      setToken(data.tokens.access)
      setUser(data.user)
      localStorage.setItem('token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
