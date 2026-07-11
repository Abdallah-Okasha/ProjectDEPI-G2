import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Breadcrumbs from '../components/Breadcrumbs'

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
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
  }, [id])

  if (loading) {
    return (
      <>
        <div className="px-4" style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Product' }]} />
        </div>
        <p className="text-center p-5">Loading...</p>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <div className="px-4" style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Product' }]} />
        </div>
        <p className="text-center p-5">Product not found</p>
      </>
    )
  }

  return (
    <>
      <div className="px-4" style={{ maxWidth: 900, margin: '0 auto' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: product.title }]} />
      </div>
      <div id="productDetails" className="productDetails text-center p-5">
        <div className="product-details">
          <img src={product.thumbnail} alt={product.title} />
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <h3>${product.price}</h3>
        </div>
      </div>
    </>
  )
}
