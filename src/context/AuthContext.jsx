import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || 'user'
  })

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('userEmail') || ''
  })

  function login(email, role = 'user') {
    setIsLoggedIn(true)
    setRole(role)
    setEmail(email)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('role', role)
    localStorage.setItem('userEmail', email)
  }

  function logout() {
    setIsLoggedIn(false)
    setRole('user')
    setEmail('')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('role')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
