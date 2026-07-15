import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'

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
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(null)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const sections = [
    { key: 'items', title: 'Manage Items', desc: 'View, add, and delete products from the catalog.', link: '/manage-items' },
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
          <div key={s.key} className="product bg-white rounded text-start p-4" style={{ cursor: 'pointer' }} onClick={() => s.link ? navigate(s.link) : setActiveSection(activeSection === s.key ? null : s.key)}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-1">{s.title}</h3>
                <p className="mb-0">{s.desc}</p>
              </div>
              {s.component && (
                <span style={{ fontSize: 20, transition: 'transform 0.2s', transform: activeSection === s.key ? 'rotate(180deg)' : 'none' }}>▼</span>
              )}
            </div>
            {activeSection === s.key && s.component && (
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
