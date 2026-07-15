import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'

const categories = [
  'beauty', 'furniture', 'groceries', 'smartphones',
  'laptops', 'mens-shirts', 'womens-dresses', 'books',
  'home-decoration', 'skin-care', 'tops', 'sunglasses',
]

const initialForm = {
  title: '', price: '', description: '', category: 'beauty', image: '',
}

export default function ManageItems() {
  const { isLoggedIn, role } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [apiProducts, setApiProducts] = useState([])
  const [customProducts, setCustomProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  if (!isLoggedIn || role !== 'admin') {
    navigate('/login', { replace: true })
    return null
  }

  useEffect(() => {
    axios('https://dummyjson.com/products?limit=100')
      .then(res => setApiProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadCustom()
  }, [])

  function loadCustom() {
    try {
      setCustomProducts(JSON.parse(localStorage.getItem('customProducts')) || [])
    } catch {
      setCustomProducts([])
    }
  }

  function saveCustom(list) {
    localStorage.setItem('customProducts', JSON.stringify(list))
    setCustomProducts(list)
  }

  function deleteCustom(id) {
    saveCustom(customProducts.filter(p => p.id !== id))
    setSuccess('Product deleted')
    setTimeout(() => setSuccess(''), 2500)
  }

  function deleteApi(id) {
    setApiProducts(prev => prev.filter(p => p.id !== id))
    setSuccess('Product removed from view')
    setTimeout(() => setSuccess(''), 2500)
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Enter a valid price'
    if (!form.image.trim()) errs.image = 'Image URL is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!validate()) return

    const newItem = {
      id: 'custom-' + Date.now(),
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      category: form.category,
      thumbnail: form.image.trim(),
      discountPercentage: 0,
      rating: 0,
    }
    saveCustom([...customProducts, newItem])
    setForm(initialForm)
    setErrors({})
    setSuccess('Product added successfully!')
    setTimeout(() => setSuccess(''), 2500)
  }

  const allProducts = [...apiProducts, ...customProducts]
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto" style={{ maxWidth: 900, padding: '40px 20px' }}>
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Manage Items' },
      ]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Items</h1>
        <div className="d-flex gap-2">
          <button className={`btn ${tab === 'all' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setTab('all')}>Delete Item</button>
          <button className={`btn ${tab === 'add' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setTab('add')}>Add Item</button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2">
          <i className="bi bi-check-circle-fill"></i> {success}
        </div>
      )}

      {tab === 'add' && (
        <form onSubmit={handleAdd} className="bg-white rounded p-4 shadow-sm mb-4">
          <h4 className="mb-3">Add New Product</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Product Title *</label>
              <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Wireless Headphones" />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-semibold">Price ($) *</label>
              <input type="number" step="0.01" className={`form-control ${errors.price ? 'is-invalid' : ''}`} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Image URL *</label>
            <input className={`form-control ${errors.image ? 'is-invalid' : ''}`} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://example.com/image.jpg" />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            {form.image && <img src={form.image} alt="preview" style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} onError={e => e.target.style.display = 'none'} />}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
          </div>
          <button type="submit" className="btn btn-success px-4">
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </button>
        </form>
      )}

      {tab === 'all' && (
        <div className="bg-white rounded p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">All Products ({filtered.length})</h4>
            <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <p className="text-muted">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted">No products match your search.</p>
          ) : (
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              <table className="table table-hover mb-0">
                <thead className="table-success">
                  <tr>
                    <th style={{ width: 50 }}></th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th style={{ width: 100 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isCustom = String(p.id).startsWith('custom-')
                    return (
                      <tr key={p.id}>
                        <td>
                          <img src={p.thumbnail} alt={p.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                        </td>
                        <td>
                          {p.title}
                          {isCustom && <span className="badge bg-info ms-2" style={{ fontSize: 11 }}>custom</span>}
                        </td>
                        <td>${p.price}</td>
                        <td><span className="text-capitalize">{p.category}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => isCustom ? deleteCustom(p.id) : deleteApi(p.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
