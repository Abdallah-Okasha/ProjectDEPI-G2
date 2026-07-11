import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem('wishlist')) || [])
    } catch {
      setWishlist([])
    }
  }, [])

  function removeItem(id) {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  return (
    <>
      <div className="container py-5" style={{ maxWidth: '900px' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist' },
          ]}
        />

        <h1 className="text-center mb-5 fw-bold">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-5">
            <p className="fs-5 text-secondary mb-0">Your wishlist is empty.</p>
            <button className="btn btn-dark mt-3 rounded-pill px-4" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {wishlist.map(item => (
              <div
                key={item.id}
                className="card shadow border-0 rounded-4"
              >
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div className="flex-grow-1">
                    <strong>{item.title}</strong>
                    <div className="text-muted">${item.price}</div>
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => addToCart(item.title, item.price)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
