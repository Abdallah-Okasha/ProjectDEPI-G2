import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderMsg, setOrderMsg] = useState('')

  function confirmOrder(e) {
    e.preventDefault()

    if (cart.length === 0) {
      setOrderMsg('Cart is empty')
      setTimeout(() => setOrderMsg(''), 2000)
      return
    }

    const order = {
      date: Date.now(),
      items: [...cart],
      total: +cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2),
      status: 'Pending'
    }
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]')
    history.push(order)
    localStorage.setItem('orderHistory', JSON.stringify(history))

    clearCart()
    setOrderMsg('Order confirmed! Thank you for your order.')

    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  return (
    <>
      {orderMsg && <div className="toast-container position-fixed bottom-0 end-0 p-3"><div className="toast align-items-center text-bg-success border-0 show" role="alert"><div className="toast-body">{orderMsg}</div></div></div>}

      <div className="px-4" style={{ maxWidth: 700, margin: '0 auto' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      </div>
      <h1 className="text-center mt-3">Checkout</h1>

      <form className="form bg-white rounded shadow p-4 mx-auto" onSubmit={confirmOrder}>
        <input type="text" className="form-control" placeholder="Full Name" required />
        <input type="text" className="form-control" placeholder="Address" required />
        <input type="text" className="form-control" placeholder="Phone" />
        <button type="submit" className="btn btn-success w-100">Confirm order</button>
      </form>
    </>
  )
}
