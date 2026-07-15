import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'

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

function checkPasswordReqs(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
  }
}

function allReqsMet(reqs) {
  return reqs.length && reqs.upper && reqs.lower && reqs.digit
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

    const reqs = checkPasswordReqs(password)

    if (isSignup && password !== confirmPassword) {
      setConfirmError('Passwords do not match')
      valid = false
    }

    if (!valid) {
      setStatus({ message: 'Wrong password', type: 'error' })
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
      login(email, role)
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
      login(email, role)
      setStatus({ message: 'Login successful', type: 'success' })
      setTimeout(() => navigate('/'), 500)
    }
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
      <div style={{ width: 350 }} className="mb-2">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Login' }]} />
      </div>
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
            className={`form-control${passwordError ? ' is-invalid' : ''}`}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {isSignup && (() => {
            const reqs = checkPasswordReqs(password)
            const items = [
              { key: 'length', label: 'At least 8 characters' },
              { key: 'upper', label: 'One uppercase letter' },
              { key: 'lower', label: 'One lowercase letter' },
              { key: 'digit', label: 'One number' },
            ]
            return (
              <ul className="mt-2 mb-0" style={{ listStyle: 'none', padding: 0, fontSize: 13 }}>
                {items.map(item => (
                  <li key={item.key} style={{ color: reqs[item.key] ? '#2a9d6f' : '#dc3545' }}>
                    {reqs[item.key] ? '✓' : '✗'} {item.label}
                  </li>
                ))}
              </ul>
            )
          })()}
          {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
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
