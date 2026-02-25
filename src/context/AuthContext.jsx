import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user || null)
        setToken(parsed.token || null)
      }
    } catch (e) {
      console.warn('Failed to parse auth from localStorage', e)
    }
  }, [])

  useEffect(() => {
    const data = { user, token }
    if (user && token) localStorage.setItem('auth', JSON.stringify(data))
    else localStorage.removeItem('auth')
  }, [user, token])

  const login = (userObj, jwtToken) => {
    setUser(userObj)
    setToken(jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const register = (userObj, jwtToken) => {
    // same as login for now
    login(userObj, jwtToken)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
