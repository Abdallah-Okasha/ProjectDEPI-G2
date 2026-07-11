import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { useAuth } from "../context/AuthContext";

export default function OrderHistory() {
  const { isLoggedIn, email } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [confirmingIndex, setConfirmingIndex] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 2500);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  function loadOrders() {
    const history = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );

    const userOrders = history.filter(o => o.userEmail === email);

    setOrders([...userOrders].reverse());
  }

  function toggleExpand(index) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  function requestCancel(index) {
    setConfirmingIndex(index);
  }

  function dismissCancel() {
    setConfirmingIndex(null);
  }

  function cancelOrder(index) {
    const history = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );

    const userOrders = history.filter(o => o.userEmail === email);
    const target = [...userOrders].reverse()[index];
    if (!target) return;

    const originalIndex = history.findIndex(o => o.date === target.date);
    if (originalIndex === -1) return;

    history[originalIndex] = {
      ...history[originalIndex],
      status: "Cancelled",
    };

    localStorage.setItem("orderHistory", JSON.stringify(history));
    setConfirmingIndex(null);
    setToastMsg("Order cancelled.");
    loadOrders();
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function statusBadgeClass(status) {
    switch (status) {
      case "Pending":
        return "text-bg-warning";
      case "Completed":
        return "text-bg-success";
      case "Cancelled":
        return "text-bg-danger";
      default:
        return "text-bg-secondary";
    }
  }

  return (
    <>
      {toastMsg && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show text-bg-dark border-0">
            <div className="toast-body">{toastMsg}</div>
          </div>
        </div>
      )}

      <div className="container py-5" style={{ maxWidth: "900px" }}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Order History" },
          ]}
        />

        <h1 className="text-center mb-5 fw-bold">Your Orders</h1>

        {!isLoggedIn ? (
          <div className="text-center py-5">
            <p className="fs-5 mb-3">Please log in to view your order history.</p>
            <Link to="/login" className="btn btn-dark px-4 py-2 rounded-pill">
              Log In
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <p className="fs-5 mb-0">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order, index) => {
              const isExpanded = expandedIndex === index;
              const isPending = (order.status || "Pending") === "Pending";
              const isConfirming = confirmingIndex === index;

              return (
                <div
                  key={index}
                  className="card shadow border-0 rounded-4"
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                      <div>
                        <div className="fw-semibold">
                          {order.customer?.name || "Guest"}
                        </div>
                        <div className="text-muted small">
                          {formatDate(order.date)}
                        </div>
                      </div>

                      <span
                        className={`badge rounded-pill ${statusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div className="text-muted small">
                        {order.items?.length || 0} item
                        {order.items?.length === 1 ? "" : "s"}
                        {order.payment && (
                          <>
                            {" • "}
                            {order.payment.method === "Card"
                              ? `${order.payment.brand} •••• ${order.payment.last4}`
                              : order.payment.method}
                          </>
                        )}
                      </div>

                      <div className="fw-bold fs-5">
                        ${order.total?.toFixed(2)}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-2">
                      <button
                        className="btn btn-link btn-sm px-0"
                        onClick={() => toggleExpand(index)}
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>

                      {isPending && !isConfirming && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => requestCancel(index)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {isConfirming && (
                      <div className="d-flex align-items-center justify-content-between gap-2 mt-3 p-3 bg-danger-subtle rounded-3">
                        <span className="small fw-medium text-danger-emphasis">
                          Cancel this order? This can't be undone.
                        </span>
                        <div className="d-flex gap-2 flex-shrink-0">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cancelOrder(index)}
                          >
                            Yes, cancel
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={dismissCancel}
                          >
                            Keep order
                          </button>
                        </div>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="border-top pt-3 mt-3">
                        <div className="mb-3">
                          <div className="text-muted small mb-1">
                            Shipping Address
                          </div>
                          <div>{order.customer?.address}</div>
                          <div>{order.customer?.phone}</div>
                        </div>

                        <div className="text-muted small mb-2">Items</div>

                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="d-flex justify-content-between mb-2"
                          >
                            <div>
                              {item.title}
                              <span className="text-muted"> × {item.qty}</span>
                            </div>
                            <div>
                              ${(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}