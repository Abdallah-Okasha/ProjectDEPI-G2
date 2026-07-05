import { useEffect, useRef } from 'react'
import { Toast } from 'bootstrap'
import { useCart } from '../context/CartContext'

export default function CartMessage() {
  const { message } = useCart()
  const toastRef = useRef(null)
  const toastInstance = useRef(null)

  useEffect(() => {
    if (toastRef.current && !toastInstance.current) {
      toastInstance.current = new Toast(toastRef.current)
    }
  }, [])

  useEffect(() => {
    if (message && toastInstance.current) {
      toastRef.current.querySelector('.toast-body').textContent = message
      toastInstance.current.show()
    }
  }, [message])

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div ref={toastRef} className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body"></div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}
