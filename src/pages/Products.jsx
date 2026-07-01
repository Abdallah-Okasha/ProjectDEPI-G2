import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categoryFilters = [
  { name: 'All Products', image: '/imgs/fe20e5572cf901ea950e5728870c422f.jpg', slug: 'all' },
  { name: 'Makeup', image: '/imgs/images.png', slug: 'beauty' },
  { name: 'Furniture', image: '/imgs/1999171.png', slug: 'furniture' },
  { name: 'Food', image: '/imgs/1261163.png', slug: 'groceries' },
  { name: 'Phones', image: '/imgs/smartphone-with-check-icon-screen-place-orange-shopping-cart-with-sale-tag-it-online-shopping-concept-vector-flat-illustration-isolated-white-background-web-site-purchase-paying_950941-671.avif', slug: 'smartphones' },
  { name: 'Electronics', image: '/imgs/4472726.png', slug: 'laptops' },
  { name: 'Clothes', image: '/imgs/2935183.png', slug: 'mens-shirts' },
]

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { isLoggedIn } = useAuth()
  const { addToCart, showMessage } = useCart()
  const navigate = useNavigate()
  const activeCategory = searchParams.get('category') || 'all'
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })

  function toggleWishlist(product) {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      const updated = exists ? prev.filter(p => p.id !== product.id) : [...prev, { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail }]
      localStorage.setItem('wishlist', JSON.stringify(updated))
      return updated
    })
  }

  function isInWishlist(id) {
    return wishlist.some(p => p.id === id)
  }

  async function getProducts() {
    setLoading(true)
    const url = activeCategory === 'all'
      ? 'https://dummyjson.com/products?limit=100'
      : `https://dummyjson.com/products/category/${activeCategory}`

    try {
      const { data } = await axios(url)
      setProducts(data.products || [])
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [activeCategory])

  function filterCategory(slug) {
    navigate(`/products?category=${slug}`)
  }

  return (
    <>
      <h1 className="text-center mt-5">Categories</h1>

      <div className="category-cards">
        {categoryFilters.map(cat => (
          <div
            key={cat.slug}
            className="category-card bg-white text-center rounded"
            onClick={() => filterCategory(cat.slug)}
          >
            <img src={cat.image} alt={cat.name} />
            <p className="fw-bold mt-2">{cat.name}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-center p-5">Loading products...</p>
      ) : (
        <div id="products" className="products">
          {products.map(product => (
            <div key={product.id} className="product bg-white rounded text-center position-relative">
              <button className="btn position-absolute top-0 end-0 fs-4 p-1 border-0" style={{ color: isInWishlist(product.id) ? 'red' : '#ccc', background: 'none' }} onClick={() => {
  if (!isLoggedIn) {
    showMessage('Please sign in first')
    return
  }
  toggleWishlist(product)
}}>♥</button>
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <div className="buttons d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-success flex-fill"
                  onClick={() => {
                    if (!isLoggedIn) {
                      showMessage('Please sign in first')
                      return
                    }
                    addToCart(product.title, product.price)
                  }}
                >
                  Add to cart
                </button>
                <button className="btn btn-success flex-fill" onClick={() => navigate(`/product?id=${product.id}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
