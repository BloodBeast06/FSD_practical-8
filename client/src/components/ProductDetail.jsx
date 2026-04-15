import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { createProductPlaceholder, getProductImage } from "../utils/productImage";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, fetchProductById, loading, error } = useProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(id).catch(() => {});
  }, [fetchProductById, id]);

  if (loading && !selectedProduct) {
    return (
      <div className="detail-skeleton">
        <div className="skeleton-img-large" />
        <div className="detail-skeleton-info">
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line medium" />
        </div>
      </div>
    );
  }

  if (error && !selectedProduct) {
    return (
      <div className="error-state">
        <div className="error-icon">!</div>
        <h2>Product not found</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Shop
        </button>
      </div>
    );
  }

  if (!selectedProduct) {
    return null;
  }

  const handleAddToCart = () => {
    addItem(selectedProduct, quantity);
    navigate("/cart");
  };

  return (
    <div className="detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span className="breadcrumb-cat">{selectedProduct.category}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-image-panel">
          <div className="detail-image-frame">
            <img
              src={getProductImage(
                selectedProduct.image,
                selectedProduct.title,
                selectedProduct.category
              )}
              alt={selectedProduct.title}
              className="detail-image"
              onError={(event) => {
                event.currentTarget.src = createProductPlaceholder(
                  selectedProduct.title,
                  selectedProduct.category
                );
              }}
            />
          </div>
        </div>

        <div className="detail-info-panel">
          <span className="detail-category">{selectedProduct.category}</span>
          <h1 className="detail-title">{selectedProduct.title}</h1>

          <div className="detail-rating">
            <span className="stars large">
              {"*".repeat(Math.round(selectedProduct.rating?.rate || 0))}
            </span>
            <span className="rating-value">
              {selectedProduct.rating?.rate || 0}/5
            </span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${selectedProduct.price.toFixed(2)}</span>
          </div>

          <p className="detail-description">{selectedProduct.description}</p>

          <div className="detail-actions">
            <div className="qty-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((value) => value + 1)}
              >
                +
              </button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
