import Breadcrumbs from '../components/Breadcrumbs'

export default function About() {
  return (
    <div className="mx-auto text-center p-5" style={{ maxWidth: 700 }}>
      <div className="text-start">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </div>
      <h1>About SuperShelf Store</h1>
      <p>
        SuperShelf Store is a simple e-commerce website that allows users to browse different
        products and view their details. The website provides an easy way for users to
        explore items and choose what they like
      </p>
      <p>
        The goal of SuperShelf Store is to provide a clear and simple online shopping experience
        where users can easily find products and view them in an organized way
      </p>
    </div>
  )
}
