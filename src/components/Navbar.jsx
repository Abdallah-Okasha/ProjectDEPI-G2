import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { isLoggedIn, role, logout } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="nav">
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
        <h2>SuperShelf Store</h2>
      </Link>
      <div className="d-flex gap-4 flex-wrap align-items-center">
        <Link to="/" className="text-white text-decoration-none fw-medium">Home</Link>
        <Link to="/products" className="text-white text-decoration-none fw-medium">Products</Link>
                <Link to="/cart" className="text-white text-decoration-none fw-medium">Cart</Link>
        <Link to="/about" className="text-white text-decoration-none fw-medium">About</Link>
        <div className="profile-dropdown" ref={ref}>
          <button className="profile-btn" onClick={() => setOpen(!open)}>
            Profile
          </button>
          {open && (
            <div className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  {role === 'admin' && (
                    <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/dashboard') }}>
                      <i className="bi bi-speedometer2 me-2"></i>Dashboard
                    </button>
                  )}
                  <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/orders') }}>
                    <i className="bi bi-box-seam me-2"></i>Orders
                  </button>
                  <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/wishlist') }}>
                    <i className="bi bi-heart me-2"></i>Wishlist
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { logout(); clearCart(); setOpen(false); navigate('/') }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </>
              ) : (
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/login') }}>
                  <i className="bi bi-person me-2"></i>Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}