import Breadcrumbs from '../components/Breadcrumbs'

export default function About() {
  const features = [
    {
      icon: 'bi-search',
      title: 'Easy Discovery',
      text: 'Browse a clean, organized catalog and find exactly what you need without the clutter.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Checkout',
      text: 'A straightforward, trustworthy checkout experience from cart to confirmation.',
    },
    {
      icon: 'bi-truck',
      title: 'Order Tracking',
      text: 'Keep an eye on every order you place, from pending to completed, in one place.',
    },
  ]

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      
      <div className="text-center mb-5 mt-3">
        <h1 className="fw-bold mb-3">About SuperShelf Store</h1>
        <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: 620 }}>
          SuperShelf Store is a simple, modern e-commerce experience built around one idea:
          shopping online should feel effortless.
        </p>
      </div>

      
      <div className="card shadow border-0 rounded-4 mb-4">
        <div className="card-body p-4 p-md-5">
          <h4 className="fw-bold mb-3">Our Mission</h4>
          <p className="text-secondary mb-3">
            We built SuperShelf Store to give shoppers a clear and organized way to explore
            products, compare options, and make confident decisions — without unnecessary
            noise or friction getting in the way.
          </p>
          <p className="text-secondary mb-0">
            From browsing to checkout to tracking your orders afterward, every part of the
            experience is designed to be simple, transparent, and easy to trust.
          </p>
        </div>
      </div>

      
      <h4 className="fw-bold text-center mb-4">Why Shop With Us</h4>

      <div className="row g-4">
        {features.map((f, i) => (
          <div className="col-md-4" key={i}>
            <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
              <div className="card-body p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle mb-3"
                  style={{ width: 56, height: 56 }}
                >
                  <i className={`bi ${f.icon} fs-4 text-primary`} />
                </div>
                <h6 className="fw-bold mb-2">{f.title}</h6>
                <p className="text-secondary small mb-0">{f.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}