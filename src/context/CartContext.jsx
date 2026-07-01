import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || []
    } catch {
      return []
    }
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(title, price) {
    setCart(prev => {
      const item = prev.find(p => p.title === title)
      if (item) {
        return prev.map(p => p.title === title ? { ...p, qty: p.qty + 1 } : p)
      }
      return [...prev, { title, price, qty: 1 }]
    })
    showMessage('Added to cart')
  }

  function removeItem(index) {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  function clearCart() {
    setCart([])
  }

  function showMessage(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, clearCart, getTotal, message, showMessage }}>
      {children}
    </CartContext.Provider>
  )
}
