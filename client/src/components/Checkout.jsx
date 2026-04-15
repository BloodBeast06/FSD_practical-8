import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../context/ProductContext";
import { createProductPlaceholder, getProductImage } from "../utils/productImage";

const STEPS = ["Shipping", "Payment", "Review"];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, index) => (
        <div key={step} className={`step ${index === current ? "active" : ""}`}>
          <div className="step-circle">{index + 1}</div>
          <span className="step-label">{step}</span>
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  function validateCurrentStep() {
    const nextErrors = {};

    if (step === 0) {
      if (!shipping.firstName.trim()) nextErrors.firstName = "Required";
      if (!shipping.lastName.trim()) nextErrors.lastName = "Required";
      if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) {
        nextErrors.email = "Valid email required";
      }
      if (!shipping.address.trim()) nextErrors.address = "Required";
      if (!shipping.city.trim()) nextErrors.city = "Required";
      if (!shipping.state.trim()) nextErrors.state = "Required";
      if (!shipping.zip.trim()) nextErrors.zip = "Required";
    }

    if (step === 1) {
      if (!payment.cardName.trim()) nextErrors.cardName = "Required";
      if (payment.cardNumber.replace(/\s/g, "").length < 16) {
        nextErrors.cardNumber = "Valid card number required";
      }
      if (!payment.expiry.trim()) nextErrors.expiry = "Required";
      if (payment.cvv.trim().length < 3) nextErrors.cvv = "Valid CVV required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (validateCurrentStep()) {
      setStep((current) => current + 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        items: items.map((item) => ({
          product: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customer: shipping,
        payment: {
          cardName: payment.cardName,
          last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
        },
        totals: {
          subtotal: totalPrice,
          shipping: shippingCost,
          tax,
          grandTotal,
        },
      };

      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate("/order-success", {
        state: { orderNumber: data.orderNumber },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to place order right now."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <div className="empty-icon">!</div>
          <h2>Nothing to checkout</h2>
          <Link to="/" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <StepIndicator current={step} />

      <div className="checkout-layout">
        <div className="checkout-form-panel">
          {step === 0 && (
            <div className="form-section">
              <h2 className="form-section-title">Shipping Information</h2>
              <div className="form-grid">
                {[
                  { key: "firstName", label: "First Name", half: true },
                  { key: "lastName", label: "Last Name", half: true },
                  { key: "email", label: "Email", type: "email" },
                  { key: "phone", label: "Phone", type: "tel" },
                  { key: "address", label: "Address" },
                  { key: "city", label: "City", half: true },
                  { key: "state", label: "State", half: true },
                  { key: "zip", label: "ZIP Code", half: true },
                ].map(({ key, label, type = "text", half }) => (
                  <div key={key} className={`form-group ${half ? "half" : ""}`}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className={`form-input ${errors[key] ? "error" : ""}`}
                      value={shipping[key]}
                      onChange={(event) =>
                        setShipping((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                    />
                    {errors[key] && <span className="form-error">{errors[key]}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-section">
              <h2 className="form-section-title">Payment Details</h2>
              <div className="card-preview">
                <div className="card-number-display">
                  {payment.cardNumber || "XXXX XXXX XXXX XXXX"}
                </div>
                <div className="card-bottom">
                  <span>{payment.cardName || "CARDHOLDER NAME"}</span>
                  <span>{payment.expiry || "MM/YY"}</span>
                </div>
              </div>
              <div className="form-grid">
                {[
                  { key: "cardName", label: "Name on Card" },
                  { key: "cardNumber", label: "Card Number" },
                  { key: "expiry", label: "Expiry", half: true },
                  { key: "cvv", label: "CVV", half: true, type: "password" },
                ].map(({ key, label, half, type = "text" }) => (
                  <div key={key} className={`form-group ${half ? "half" : ""}`}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className={`form-input ${errors[key] ? "error" : ""}`}
                      value={payment[key]}
                      onChange={(event) =>
                        setPayment((current) => ({
                          ...current,
                          [key]:
                            key === "cardNumber"
                              ? event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 16)
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim()
                              : event.target.value,
                        }))
                      }
                    />
                    {errors[key] && <span className="form-error">{errors[key]}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h2 className="form-section-title">Review Order</h2>
              <div className="review-section">
                <h3 className="review-sub">Shipping To</h3>
                <p>
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.state} {shipping.zip}
                </p>
                <p>{shipping.email}</p>
              </div>
              <div className="review-section">
                <h3 className="review-sub">Items</h3>
                {items.map((item) => (
                  <div key={item._id} className="review-item">
                    <img
                      src={getProductImage(item.image, item.title, item.category)}
                      alt={item.title}
                      className="review-item-img"
                      onError={(event) => {
                        event.currentTarget.src = createProductPlaceholder(
                          item.title,
                          item.category
                        );
                      }}
                    />
                    <div className="review-item-info">
                      <span className="review-item-title">{item.title}</span>
                      <span className="review-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="review-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {errorMessage && <p className="form-error">{errorMessage}</p>}
            </div>
          )}

          <div className="form-nav">
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </div>
        </div>

        <div className="checkout-summary-panel">
          <div className="summary-card">
            <h2 className="summary-title">Summary</h2>
            <div className="checkout-item-list">
              {items.map((item) => (
                <div key={item._id} className="checkout-mini-item">
                  <span className="checkout-mini-qty">{item.quantity}x</span>
                  <span className="checkout-mini-name">{item.title}</span>
                  <span className="checkout-mini-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
