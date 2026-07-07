import { useNavigate } from 'react-router-dom'

const hotDeals = [
  {
    id: 78,
    title: 'Apple MacBook Pro 14 Inch Space Grey',
    originalPrice: 1999.99,
    price: 1906,
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
    discount: 5
  },
  {
    id: 123,
    title: 'iPhone 13 Pro',
    originalPrice: 1099.99,
    price: 997,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp',
    discount: 9
  },
  {
    id: 11,
    title: 'Annibale Colombo Bed',
    originalPrice: 1899.99,
    price: 1737,
    image: 'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp',
    discount: 9
  },
  {
    id: 83,
    title: 'Blue & Black Check Shirt',
    originalPrice: 29.99,
    price: 25,
    image: 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp',
    discount: 15
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero text-center" style={{ background: '#f8f9fa', color: '#1e2228', padding: '100px 20px' }}>
        <h1 className="mb-4" style={{ color: '#1e2228' }}>Welcome to SuperShelf Store</h1>
        <p style={{ color: '#6b7280' }}>Best products with good prices</p>
        <button
          className="btn"
          style={{ background: '#2a9d6f', borderColor: '#2a9d6f', color: '#fff', fontWeight: 600 }}
          onClick={() => navigate('/products')}
          onMouseEnter={e => { e.target.style.background = '#238b60'; e.target.style.borderColor = '#238b60' }}
          onMouseLeave={e => { e.target.style.background = '#2a9d6f'; e.target.style.borderColor = '#2a9d6f' }}
        >
          Browse Products
        </button>
      </section>

      <section style={{ background: '#1e2228', padding: '40px 0' }}>
        <div className="text-center" style={{ maxWidth: '70%', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ width: '40px', height: '3px', background: '#f77f00', margin: '0 auto 16px', borderRadius: '2px' }} />
          <p style={{ color: '#2a9d6f', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            LIMITED TIME
          </p>
          <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            🔥 Hottest Deals
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
            Grab these before they're gone
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}>
            {hotDeals.map(deal => (
              <div
                key={deal.id}
                className="rounded"
                style={{ background: '#ffffff', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'relative', cursor: 'pointer' }}
                onClick={() => navigate(`/product?id=${deal.id}`)}
              >
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: '#f77f00', color: '#fff',
                  padding: '3px 10px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: 'bold', zIndex: 2
                }}>
                  -{deal.discount}%
                </div>

                <div style={{ textAlign: 'center', padding: '12px 0 0', fontSize: '12px', color: '#f77f00', fontFamily: 'monospace' }}>
                  Ends in: 04:12:33
                </div>

                <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', background: '#fafafa' }}>
                  <img src={deal.image} alt={deal.title} style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
                </div>

                <div style={{ padding: '15px' }}>
                  <h6 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px', color: '#333' }}>
                    {deal.title}
                  </h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#2a9d6f' }}>${deal.price.toFixed(2)}</span>
                    <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>${deal.originalPrice.toFixed(2)}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#2a9d6f', margin: '0 0 12px', fontWeight: 600 }}>
                    You save ${(deal.originalPrice - deal.price).toFixed(2)}
                  </p>

                  <button
                    className="btn btn-success w-100"
                    style={{ borderRadius: '6px', fontWeight: 600, fontSize: '13px' }}
                    onClick={e => { e.stopPropagation(); navigate(`/product?id=${deal.id}`) }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              className="btn btn-outline-light"
              style={{ borderRadius: '6px', fontWeight: 600, padding: '10px 30px', borderColor: '#2a9d6f', color: '#2a9d6f' }}
              onClick={() => navigate('/products')}
              onMouseEnter={e => { e.target.style.background = '#2a9d6f'; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2a9d6f' }}
            >
              View All Deals →
            </button>
          </div>
        </div>
      </section>

      <section className="text-center py-5" style={{ background: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>
        <h2 className="mb-4" style={{ color: '#1e2228', fontSize: '28px', fontWeight: 'bold' }}>Why Shop With Us</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          maxWidth: '70%',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px', color: '#2a9d6f' }}>🚚</div>
            <h5 style={{ color: '#1e2228', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>Free Shipping</h5>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>On orders over $50</p>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px', color: '#2a9d6f' }}>💬</div>
            <h5 style={{ color: '#1e2228', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>24/7 Support</h5>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>We're here to help</p>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px', color: '#2a9d6f' }}>🔒</div>
            <h5 style={{ color: '#1e2228', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>Secure Payments</h5>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>100% safe checkout</p>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px', color: '#2a9d6f' }}>↩️</div>
            <h5 style={{ color: '#1e2228', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>Easy Returns</h5>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>30-day return policy</p>
          </div>
        </div>
      </section>
    </>
  )
}