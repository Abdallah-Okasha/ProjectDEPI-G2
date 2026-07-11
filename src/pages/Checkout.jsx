import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Checkout() {
  const { cart, clearCart, getTotal } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); 

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [orderMsg, setOrderMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  }

 

  function formatCardNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function handleCardChange(e) {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "cardNumber") formatted = formatCardNumber(value);
    if (name === "expiry") formatted = formatExpiry(value);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 4);

    setCardData({
      ...cardData,
      [name]: formatted,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function detectCardBrand(number) {
    const digits = number.replace(/\D/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "American Express";
    return "Card";
  }

  function isExpiryValid(expiry) {
    const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(`20${match[2]}`, 10);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiryDate = new Date(year, month); 
    return expiryDate > now;
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Full name is required.";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";

    if (!formData.address.trim())
      newErrors.address = "Address is required.";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (paymentMethod === "card") {
      const digits = cardData.cardNumber.replace(/\D/g, "");

      if (!cardData.cardName.trim())
        newErrors.cardName = "Name on card is required.";

      if (digits.length < 13 || digits.length > 16)
        newErrors.cardNumber = "Enter a valid card number.";

      if (!isExpiryValid(cardData.expiry))
        newErrors.expiry = "Enter a valid, non-expired date (MM/YY).";

      if (!/^\d{3,4}$/.test(cardData.cvv))
        newErrors.cvv = "Enter a valid CVV.";
    }

    return newErrors;
  }

  function confirmOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
      setOrderMsg("Your cart is empty.");
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    
    const paymentInfo =
      paymentMethod === "card"
        ? {
            method: "Card",
            brand: detectCardBrand(cardData.cardNumber),
            last4: cardData.cardNumber.replace(/\D/g, "").slice(-4),
          }
        : { method: "Cash on Delivery" };

    const order = {
      customer: formData,
      payment: paymentInfo,
      date: Date.now(),
      items: [...cart],
      total,
      status: "Pending",
    };

    const history = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );

    history.push(order);

    localStorage.setItem("orderHistory", JSON.stringify(history));


    setTimeout(() => {
      clearCart();
      setLoading(false);
      setOrderMsg("Order placed successfully!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 900);
  }

  return (
    <>
      {orderMsg && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show text-bg-success border-0">
            <div className="toast-body">{orderMsg}</div>
          </div>
        </div>
      )}

      <div className="container py-5" style={{ maxWidth: "900px" }}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <h1 className="text-center mb-5 fw-bold">Checkout</h1>

        <div className="row g-4">
          {/* Checkout Form */}
          <div className="col-lg-7">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="mb-4">Shipping Information</h4>

                <form onSubmit={confirmOrder} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      rows="3"
                      name="address"
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.address}</div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
                  </div>

                  <hr className="my-4" />

                  <h4 className="mb-3">Payment Method</h4>

                  <div className="d-flex gap-3 mb-4">
                    <div
                      role="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-fill border rounded-3 p-3 text-center ${
                        paymentMethod === "card"
                          ? "border-primary border-2 bg-light"
                          : "border-secondary-subtle"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input me-2"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      Credit / Debit Card
                    </div>

                    <div
                      role="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex-fill border rounded-3 p-3 text-center ${
                        paymentMethod === "cod"
                          ? "border-primary border-2 bg-light"
                          : "border-secondary-subtle"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input me-2"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      Cash on Delivery
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="border rounded-3 p-3 mb-4 bg-light-subtle">
                      <div className="mb-3">
                        <label className="form-label">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          className={`form-control ${errors.cardName ? "is-invalid" : ""}`}
                          value={cardData.cardName}
                          onChange={handleCardChange}
                          placeholder="John Doe"
                        />
                        <div className="invalid-feedback">{errors.cardName}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          inputMode="numeric"
                          className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="invalid-feedback">{errors.cardNumber}</div>
                      </div>

                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="expiry"
                            inputMode="numeric"
                            className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                          />
                          <div className="invalid-feedback">{errors.expiry}</div>
                        </div>

                        <div className="col-6 mb-3">
                          <label className="form-label">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            inputMode="numeric"
                            className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="•••"
                          />
                          <div className="invalid-feedback">{errors.cvv}</div>
                        </div>
                      </div>

                      <div className="text-muted small">
                        <i className="bi bi-lock-fill me-1" />
                        Your card details are used only to complete this order and are not stored.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm Order"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="mb-4">Order Summary</h4>

                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-3"
                  >
                    <div>
                      {item.title}
                      <span className="text-muted"> × {item.qty}</span>
                    </div>
                    <div>${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}