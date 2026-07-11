import { useState, useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'

function WishlistSection() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || []
    } catch {
      return []
    }
  })
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  function removeItem(id) {
    setWishlist(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div>
      {wishlist.length === 0 ? (
        <p className="text-muted">Your wishlist is empty. Add items from the Products page.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {wishlist.map(item => (
            <div key={item.id} className="d-flex align-items-center gap-3 border rounded p-2">
              <img src={item.thumbnail} alt={item.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
              <div className="flex-grow-1">
                <strong>{item.title}</strong><br />
                <span className="text-muted">${item.price}</span>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={e => { e.stopPropagation(); removeItem(item.id) }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OrderHistorySection() {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orderHistory')) || []
    } catch {
      return []
    }
  })

  return (
    <div>
      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="border rounded p-3 mb-3">
            <p className="mb-1 text-muted small">{new Date(order.date).toLocaleString()}</p>
            {order.items.map((item, j) => (
              <div key={j} className="d-flex justify-content-between">
                <span>{item.title} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <p className="text-end mb-0 fw-bold">Total: ${order.total.toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  )
}

function ManageProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios('https://dummyjson.com/products?limit=100')
      .then(res => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function removeProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input className="form-control mb-3" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
      {loading ? (
        <p>Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filtered.map(p => (
            <div key={p.id} className="d-flex align-items-center gap-3 border-bottom py-2">
              <img src={p.thumbnail} alt={p.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />
              <div className="flex-grow-1">
                <strong>{p.title}</strong><br />
                <span className="text-muted">${p.price}</span>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={e => { e.stopPropagation(); removeProduct(p.id) }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ManageUsersSection() {
  const [users, setUsers] = useState(() => getUsers())
  const [confirm, setConfirm] = useState(null)

  function getUsers() {
    try { return JSON.parse(localStorage.getItem('users')) || [] } catch { return [] }
  }

  function saveAndRefresh(updated) {
    localStorage.setItem('users', JSON.stringify(updated))
    setUsers(updated)
    setConfirm(null)
  }

  function revoke(email) {
    saveAndRefresh(users.filter(u => u.email.toLowerCase() !== email.toLowerCase()))
  }

  function promote(email) {
    saveAndRefresh(users.map(u =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, role: 'admin' } : u
    ))
  }

  return (
    <div>
      {users.length === 0 ? (
        <p className="text-muted">No registered users.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.email}</td>
                <td>{u.email.toLowerCase() === 'abdallah.okasha42@gmail.com' ? 'admin' : (u.role || 'user')}</td>
                <td className="d-flex gap-2">
                  {u.email.toLowerCase() !== 'abdallah.okasha42@gmail.com' && (
                    <>
                      {confirm === i ? (
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); revoke(u.email) }}>Confirm</button>
                          <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); setConfirm(null) }}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={e => { e.stopPropagation(); setConfirm(i) }}>Revoke</button>
                      )}
                      {u.role !== 'admin' && (
                        confirm === `promote-${i}` ? (
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={e => { e.stopPropagation(); promote(u.email) }}>Confirm</button>
                            <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); setConfirm(null) }}>Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-sm btn-outline-success" onClick={e => { e.stopPropagation(); setConfirm(`promote-${i}`) }}>Promote</button>
                        )
                      )}
                    </>
                  )}
                  {u.email.toLowerCase() === 'abdallah.okasha42@gmail.com' && <span className="text-muted">Protected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function OrdersSection() {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orderHistory')) || []
    } catch {
      return []
    }
  })

  function updateStatus(index, status) {
    setOrders(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], status }
      localStorage.setItem('orderHistory', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div>
      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">{new Date(order.date).toLocaleString()}</span>
              <span className={`badge ${order.status === 'Shipped' ? 'bg-success' : order.status === 'Processing' ? 'bg-warning' : 'bg-secondary'}`}>
                {order.status || 'Pending'}
              </span>
            </div>
            {order.items.map((item, j) => (
              <div key={j} className="d-flex justify-content-between">
                <span>{item.title} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <p className="text-end mb-2 fw-bold">Total: ${order.total.toFixed(2)}</p>
            {order.status !== 'Cancelled' && order.status !== 'Shipped' && (
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-warning" onClick={e => { e.stopPropagation(); updateStatus(i, 'Processing') }}>Mark Processing</button>
                <button className="btn btn-sm btn-outline-success" onClick={e => { e.stopPropagation(); updateStatus(i, 'Shipped') }}>Mark Shipped</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default function Dashboard() {
  const { isLoggedIn, role } = useAuth()
  const [activeSection, setActiveSection] = useState(null)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const sections = [
    { key: 'products', title: 'Manage Products', desc: 'Add, edit, or remove products from the catalog.', component: <ManageProductsSection /> },
    { key: 'users', title: 'Manage Users', desc: 'View and manage registered users.', component: <ManageUsersSection /> },
    { key: 'orders', title: 'Orders', desc: 'View all customer orders and update their status.', component: <OrdersSection /> },
  ]

  return (
    <div className="mx-auto" style={{ maxWidth: 800, padding: '40px 20px' }}>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
      <h1 className="text-center mt-0 mb-4">Dashboard</h1>

      <h2>Admin Panel</h2>
      <div className="d-grid gap-4 mt-4">
        {sections.map(s => (
          <div key={s.key} className="product bg-white rounded text-start p-4" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-1">{s.title}</h3>
                <p className="mb-0">{s.desc}</p>
              </div>
              <span className={`text-muted ${activeSection === s.key ? 'rotate-arrow' : ''}`} style={{ fontSize: 20, transition: 'transform 0.2s', transform: activeSection === s.key ? 'rotate(180deg)' : 'none' }}>▼</span>
            </div>
            {activeSection === s.key && (
              <div className="mt-3 pt-3 border-top">
                {s.component}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
