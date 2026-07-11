import { Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import CartProvider from './context/CartContext'
import Navbar from './components/Navbar'
import CartMessage from './components/CartMessage'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Books from './pages/Books'
import OrderHistory from './pages/OrderHistory'
import Wishlist from './pages/Wishlist'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <CartMessage />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/Books" element={<Books />} />
          <Route path="/book" element={<ProductDetails />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}