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

  function login(role = 'user') {
    setIsLoggedIn(true)
    setRole(role)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('role', role)
  }

  function logout() {
    setIsLoggedIn(false)
    setRole('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
