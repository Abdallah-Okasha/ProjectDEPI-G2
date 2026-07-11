import Books from '../data/booksData'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Book() {
  const { addToCart } = useCart()

  return (
    <section className="books-page">
      <div className="px-4" style={{ maxWidth: '70%', margin: '0 auto' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Books' }]} />
      </div>
      <div className="books-header text-center">
        <h1>Books</h1>
        <p>Selected books from Aseer Alkotb</p>
      </div>

      <div className="products">
        {books.map(book => (
          <div key={book.id} className="product bg-white rounded shadow-sm text-center">
            <img className="book-img" src={book.image} alt={book.title} />

            <h3 className="book-title">{book.title}</h3>

            <p className="book-price">${book.price}</p>

            <button
              className="btn btn-success w-100"
              onClick={() => addToCart(book.title, book.price)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}