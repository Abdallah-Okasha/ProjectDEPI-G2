import { Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import CartProvider from './context/CartContext'
import Navbar from './components/Navbar'
import CartMessage from './components/CartMessage'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <CartMessage />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
