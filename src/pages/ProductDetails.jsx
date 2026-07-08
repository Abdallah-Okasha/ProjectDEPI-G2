import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import books from '../data/booksData'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function ProductDetails() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart, showMessage } = useCart()
  const { isLoggedIn } = useAuth()

  const id = searchParams.get('id')
  const isBook = location.pathname === '/book'

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isBook) return
    async function getProduct() {
      if (!id) return
      setLoading(true)
      try {
        const { data } = await axios(`https://dummyjson.com/products/${id}`)
        setProduct(data)
      } catch {
        setProduct(null)
      }
      setLoading(false)
    }
    getProduct()
  }, [id, isBook])

  if (isBook) {
    const book = books.find(item => item.id === id)

    if (!book) {
      return (
        <>
          <div className="px-4" style={{ maxWidth: 850, margin: '0 auto' }}>
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Books', href: '/Books' }, { label: 'Book' }]} />
          </div>
          <div className="text-center p-5">
            <h2>Book not found</h2>
            <button
              className="btn btn-success mt-3"
              onClick={() => navigate('/products?category=books')}
            >
              Back to Books
            </button>
          </div>
        </>
      )
    }

    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Books', href: '/Books' },
      { label: book.title },
    ]

    return (
      <>
        <div className="px-4" style={{ maxWidth: 850, margin: '0 auto' }}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="productDetails p-5">
        <div
          className="product-details bg-white rounded shadow p-4 mx-auto"
          style={{ maxWidth: 850 }}
        >
          <div className="row align-items-center">
            <div className="col-md-5 text-center mb-4 mb-md-0">
              <img
                src={book.image}
                alt={book.title}
                style={{
                  width: 240,
                  height: 360,
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
            </div>

            <div className="col-md-7 text-start">
              <h2>{book.title}</h2>

              <p className="text-muted mb-2">
                <strong>Author:</strong> {book.author}
              </p>

              <h3 className="text-success mb-3">${book.price}</h3>

              <p style={{ lineHeight: 1.8, fontSize: 17 }}>
                {book.description}
              </p>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    if (!isLoggedIn) {
                      showMessage('Please sign in first')
                      return
                    }

                    addToCart(book.title, book.price)
                  }}
                >
                  Add to cart
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/products?category=books')}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <div className="px-4" style={{ maxWidth: 850, margin: '0 auto' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Product' }]} />
        </div>
        <p className="text-center p-5">Loading...</p>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <div className="px-4" style={{ maxWidth: 850, margin: '0 auto' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Product' }]} />
        </div>
        <p className="text-center p-5">Product not found</p>
      </>
    )
  }

  const discount = product.discountPercentage
  const originalPrice = discount ? (product.price / (1 - discount / 100)).toFixed(2) : null

  return (
    <>
      <div className="px-4" style={{ maxWidth: 850, margin: '0 auto' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: product.title }]} />
      </div>
      <div className="productDetails p-5">
        <div
          className="product-details bg-white rounded shadow p-4 mx-auto"
          style={{ maxWidth: 850 }}
        >
          <div className="row align-items-center">
            <div className="col-md-5 text-center mb-4 mb-md-0">
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  width: 240,
                  height: 360,
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
            </div>

            <div className="col-md-7 text-start">
              <h2>{product.title}</h2>

              {product.brand && (
                <p className="text-muted mb-2">
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}

              <div className="mb-3">
                <h3 className="text-success d-inline">${product.price}</h3>
                {originalPrice && (
                  <span className="text-muted text-decoration-line-through ms-2">${parseFloat(originalPrice).toFixed(2)}</span>
                )}
              </div>

              <p style={{ lineHeight: 1.8, fontSize: 17 }}>
                {product.description}
              </p>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-success"
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

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/products')}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
