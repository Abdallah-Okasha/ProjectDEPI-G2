import { useSearchParams, useNavigate } from 'react-router-dom'
import books from '../data/booksData'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function BookDetail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart, showMessage } = useCart()
  const { isLoggedIn } = useAuth()

  const id = searchParams.get('id')
  const book = books.find(item => item.id === id)

  if (!book) {
    return (
      <div className="text-center p-5">
        <h2>Book not found</h2>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate('/products?category=books')}
        >
          Back to Books
        </button>
      </div>
    )
  }

  return (
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
  )
}