import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

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
    return <p className="text-center p-5">Loading...</p>
  }

  if (!product) {
    return <p className="text-center p-5">Product not found</p>
  }

  return (
    <div id="productDetails" className="productDetails text-center p-5">
      <div className="product-details">
        <img src={product.thumbnail} alt={product.title} />
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <h3>${product.price}</h3>
      </div>
    </div>
  )
}
