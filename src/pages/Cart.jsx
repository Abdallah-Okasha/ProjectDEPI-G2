import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Cart() {
  const { cart, removeItem, clearCart, getTotal } = useCart()
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const total = getTotal()

  return (
    <section className="cart-wrapper bg-white rounded shadow p-4 mx-auto">
      <div className="px-2">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      </div>
      <h1 className="text-center mb-4">Your Shopping Cart</h1>

      <div id="cartItems" className="d-flex flex-column gap-3">
        {cart.length === 0 ? (
          <p className="text-center text-secondary">Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cartItem d-flex justify-content-between align-items-center bg-light rounded p-3 shadow-sm">
              <span>{item.title} (x{item.qty})</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>Remove</button>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <div className="fw-bold fs-5">Total: ${total.toFixed(2)}</div>
        <div className="d-flex gap-3">
          <button className="btn btn-warning" onClick={clearCart}>Clear Cart</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (cart.length === 0) return
              setShowPopup(true)
            }}
          >
            Checkout
          </button>
        </div>
      </div>

      <div className={`popup ${showPopup ? 'show' : ''}`}>
        <div className="text-center">
          <p className="bg-white rounded p-4 fs-5">Thanks for your purchase!</p>
          <button className="btn btn-success" onClick={() => {
            clearCart()
            setShowPopup(false)
            navigate('/')
          }}>Close</button>
        </div>
      </div>
    </section>
  )
}
