import { useNavigate } from 'react-router-dom'

const categories = [
  { name: 'Clothes', image: '/imgs/2935183.png', category: 'mens-shirts' },
  { name: 'Electronics', image: '/imgs/4472726.png', category: 'laptops' },
  { name: 'Furniture', image: '/imgs/1999171.png', category: 'furniture' },
  { name: 'Food', image: '/imgs/1261163.png', category: 'groceries' },
  { name: 'Books', image: '/imgs/books.png.jpg', slug: 'books' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero text-center bg-dark text-white">
        <h1 className="mb-4">Welcome to SuperShelf Store</h1>
        <p>Best products with good prices</p>
        <button className="btn btn-success" onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </section>

      <section className="text-center my-4">
        <h2>Shop by Category</h2>

        <div className="category-cards">
          {categories.map(cat => (
            <div
              key={cat.name}
              className="category-card bg-white text-center rounded"
              onClick={() => navigate(`/products?category=${cat.category}`)}
            >
              <img src={cat.image} alt={cat.name} />
              <p className="fw-bold mt-2">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}