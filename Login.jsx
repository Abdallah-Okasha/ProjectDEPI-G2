import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'abdallah.okasha42@gmail.com'

function matchEmail(a, b) {
  return a.toLowerCase() === b.toLowerCase()
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('users')) || [] } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(password)
}

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [status, setStatus] = useState({ message: '', type: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  function clearErrors() {
    setEmailError('')
    setPasswordError('')
    setConfirmError('')
    setStatus({ message: '', type: '' })
  }

  function handleSubmit() {
    clearErrors()

    let valid = true

    const domainPart = email.split('@')[1]
    if (!email.includes('@') || !domainPart || !domainPart.includes('.')) {
      setEmailError('Enter a valid email with a domain (e.g. user@domain.com)')
      valid = false
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be 8+ chars, include uppercase, lowercase, and number')
      valid = false
    }

    if (isSignup && password !== confirmPassword) {
      setConfirmError('Passwords do not match')
      valid = false
    }

    if (!valid) {
      setStatus({ message: 'Fix the errors above', type: 'error' })
      return
    }

    const users = getUsers()

    if (isSignup) {
      if (users.find(u => matchEmail(u.email, email))) {
        setEmailError('This email is already registered')
        return
      }
      users.push({ email, password, role: matchEmail(email, ADMIN_EMAIL) ? 'admin' : 'user' })
      saveUsers(users)
      const role = matchEmail(email, ADMIN_EMAIL) ? 'admin' : 'user'
      login(role)
      setStatus({ message: 'Signup successful', type: 'success' })
      setTimeout(() => navigate('/'), 500)
    } else {
      const user = users.find(u => matchEmail(u.email, email))
      if (!user) {
        setEmailError('No account found with this email. Please sign up first.')
        return
      }
      if (user.password !== password) {
        setPasswordError('Incorrect password')
        return
      }
      const role = matchEmail(email, ADMIN_EMAIL) ? 'admin' : 'user'
      login(role)
      setStatus({ message: 'Login successful', type: 'success' })
      setTimeout(() => navigate('/'), 500)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card bg-white rounded shadow p-4" style={{ width: 350 }}>
        <h2 className="text-center mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {emailError && <div className="error" id="emailError">{emailError}</div>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {passwordError && <div className="error" id="passwordError">{passwordError}</div>}
        </div>

        {isSignup && (
          <div className="mb-3" id="confirmGroup">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {confirmError && <div className="error" id="confirmError">{confirmError}</div>}
          </div>
        )}

        {status.message && (
          <div id="statusMessage" className={`status show ${status.type}`}>
            {status.message}
          </div>
        )}

        <button className="btn btn-success w-100" onClick={handleSubmit}>Submit</button>

        <div className="switch text-center mt-3">
          <span id="toggleText" onClick={() => {
            setIsSignup(!isSignup)
            clearErrors()
          }}>
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </span>
        </div>
      </div>
    </div>
  )
}
