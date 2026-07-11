import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import booksList from '../data/booksData'
import Breadcrumbs from '../components/Breadcrumbs'

const categoryFilters = [
  { name: 'All Products', image: '/imgs/fe20e5572cf901ea950e5728870c422f.jpg', slug: 'all' },
  { name: 'Books', image: '/imgs/books.png.jpg', slug: 'books' },
  { name: 'Makeup', image: '/imgs/images.png', slug: 'beauty' },
  { name: 'Furniture', image: '/imgs/1999171.png', slug: 'furniture' },
  { name: 'Food', image: '/imgs/1261163.png', slug: 'groceries' },
  { name: 'Phones', image: '/imgs/smartphone-with-check-icon-screen-place-orange-shopping-cart-with-sale-tag-it-online-shopping-concept-vector-flat-illustration-isolated-white-background-web-site-purchase-paying_950941-671.avif', slug: 'smartphones' },
  { name: 'Electronics', image: '/imgs/4472726.png', slug: 'laptops' },
  { name: 'Clothes', image: '/imgs/2935183.png', slug: 'mens-shirts' },
]

const fallbackProducts = [
  {
    id: 'makeup-1',
    title: 'Essence Mascara Lash Princess',
    price: 10,
    thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    category: 'beauty'
  },
  {
    id: 'makeup-2',
    title: 'Powder Canister',
    price: 14,
    thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
    category: 'beauty'
  },
  {
    id: 'furniture-1',
    title: 'Annibale Colombo Bed',
    price: 1899,
    thumbnail: 'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp',
    category: 'furniture'
  },
  {
    id: 'furniture-2',
    title: 'Bedside Table African Cherry',
    price: 299,
    thumbnail: 'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
    category: 'furniture'
  },
  {
    id: 'food-1',
    title: 'Apple',
    price: 2,
    thumbnail: 'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp',
    category: 'groceries'
  },
  {
    id: 'food-2',
    title: 'Beef Steak',
    price: 13,
    thumbnail: 'https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp',
    category: 'groceries'
  },
  {
    id: 'phone-1',
    title: 'iPhone 9',
    price: 549,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-9/thumbnail.webp',
    category: 'smartphones'
  },
  {
    id: 'phone-2',
    title: 'Samsung Universe 9',
    price: 1249,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-universe-9/thumbnail.webp',
    category: 'smartphones'
  },
  {
    id: 'laptop-1',
    title: 'MacBook Pro',
    price: 1749,
    thumbnail: 'https://cdn.dummyjson.com/product-images/laptops/macbook-pro/thumbnail.webp',
    category: 'laptops'
  },
  {
    id: 'laptop-2',
    title: 'Samsung Galaxy Book',
    price: 1499,
    thumbnail: 'https://cdn.dummyjson.com/product-images/laptops/samsung-galaxy-book/thumbnail.webp',
    category: 'laptops'
  },
  {
    id: 'clothes-1',
    title: 'Mens Cotton Jacket',
    price: 55,
    thumbnail: 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp',
    category: 'mens-shirts'
  },
  {
    id: 'clothes-2',
    title: 'Mens Casual Shirt',
    price: 35,
    thumbnail: 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp',
    category: 'mens-shirts'
  },
]

function formatBooks() {
  return booksList.map(book => ({
    id: book.id,
    title: book.title,
    price: book.price,
    thumbnail: book.image,
    category: 'books',
    isBook: true
  }))
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { isLoggedIn } = useAuth()
  const { addToCart, showMessage } = useCart()
  const navigate = useNavigate()

  const activeCategory = searchParams.get('category') || 'all'

  const [productsPerPage, setProductsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true
  })

  const filteredByPrice = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    return true
  })
  const totalPages = Math.ceil(filteredByPrice.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const displayedProducts = filteredByPrice.slice(startIndex, startIndex + productsPerPage)

  function toggleSection(section) {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}))
  }

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || []
    } catch {
      return []
    }
  })

  function toggleWishlist(product) {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)

      const updated = exists
        ? prev.filter(p => p.id !== product.id)
        : [
            ...prev,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail
            }
          ]

      localStorage.setItem('wishlist', JSON.stringify(updated))
      return updated
    })
  }

  function isInWishlist(id) {
    return wishlist.some(p => p.id === id)
  }

  useEffect(() => {
    async function getProducts() {
      setLoading(true)

      const bookProducts = formatBooks()

      if (activeCategory === 'books') {
        setProducts(bookProducts)
        setLoading(false)
        return
      }

      const localProducts =
        activeCategory === 'all'
          ? [...fallbackProducts, ...bookProducts]
          : fallbackProducts.filter(product => product.category === activeCategory)

      setProducts(localProducts)

      const url =
        activeCategory === 'all'
          ? 'https://dummyjson.com/products?limit=100'
          : `https://dummyjson.com/products/category/${activeCategory}`

      try {
        const { data } = await axios.get(url, { timeout: 5000 })
        const apiProducts = data.products || []

        if (activeCategory === 'all') {
          setProducts([...apiProducts, ...bookProducts])
        } else {
          setProducts(apiProducts)
        }
      } catch {
        setProducts(localProducts)
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [activeCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory])

  function filterCategory(slug) {
    navigate(`/products?category=${slug}`)
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products' },
    ...(activeCategory === 'books' ? [{ label: 'Books' }] : []),
  ]

  return (
    <>
      <div className="px-4" style={{ maxWidth: '70%', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div className="products-layout">
      <aside className="products-sidebar">
        <div className="sidebar-header">
          <h5>Filters</h5>
          <button className="reset-btn" onClick={() => { setMinPrice(''); setMaxPrice('') }}>Reset</button>
        </div>

        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('categories')}>
            <span>Categories</span>
            <span>{expandedSections.categories ? '−' : '+'}</span>
          </div>
          {expandedSections.categories && (
            <div className="filter-body">
              {categoryFilters.map(cat => (
                <div
                  key={cat.slug}
                  className={`filter-link${activeCategory === cat.slug ? ' active' : ''}`}
                  onClick={() => filterCategory(cat.slug)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('price')}>
            <span>Price</span>
            <span>{expandedSections.price ? '−' : '+'}</span>
          </div>
          {expandedSections.price && (
            <div className="filter-body">
              <div className="filter-price">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="products-main">
        <div className="products-topbar">
          <div className="topbar-left">
            <label>Show</label>
            <select value={productsPerPage} onChange={e => { setProductsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>  
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center p-5">Loading products...</p>
        ) : (
          <>
            <div id="products" className="products">
              {displayedProducts.map(product => {
                const discount = product.discountPercentage
                const originalPrice = discount ? (product.price / (1 - discount / 100)).toFixed(2) : null
                return (
                  <div
                    key={product.id}
                    className="product"
                    onClick={() => {
                      if (product.isBook) {
                        navigate(`/book?id=${product.id}`)
                      } else {
                        navigate(`/product?id=${product.id}`)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {discount > 0 && (
                      <span className="discount-badge">-{Math.round(discount)}%</span>
                    )}

                    <div className="product-image-wrapper">
                      <img src={product.thumbnail} alt={product.title} />
                      <div className="product-actions">
                        <button
                          className={`action-btn${isInWishlist(product.id) ? ' wishlist-active' : ''}`}
                          onClick={e => {
                            e.stopPropagation()
                            if (!isLoggedIn) {
                              showMessage('Please sign in first')
                              return
                            }
                            toggleWishlist(product)
                          }}
                          title="Wishlist"
                        >
                          ♥
                        </button>
                      </div>
                    </div>

                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <div className="price-row">
                        <span className="current-price">${product.price}</span>
                        {originalPrice && (
                          <span className="original-price">${parseFloat(originalPrice).toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={e => {
                        e.stopPropagation()
                        if (!isLoggedIn) {
                          showMessage('Please sign in first')
                          return
                        }
                        addToCart(product.title, product.price)
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 my-4 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`btn ${currentPage === index + 1 ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => {
                      setCurrentPage(index + 1)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
    </>
  )
}