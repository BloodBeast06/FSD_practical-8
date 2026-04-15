import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || "ORDER-PENDING";

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-animation">
          <div className="success-ring" />
          <div className="success-check">OK</div>
        </div>
        <h1 className="success-title">Order Placed</h1>
        <p className="success-subtitle">
          Your order has been saved through the Express API and MongoDB backend.
        </p>
        <div className="success-order-id">
          Order Number: <strong>{orderNumber}</strong>
        </div>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
