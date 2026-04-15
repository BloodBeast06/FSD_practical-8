import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import {
  createProductPlaceholder,
  getProductImage,
} from "../utils/productImage";

function StarRating({ rating }) {
  const stars = Math.round(rating?.rate || 0);

  return (
    <div className="star-rating">
      <span className="stars">{"*".repeat(stars)}{"-".repeat(5 - stars)}</span>
      <span className="review-count">({rating?.count || 0})</span>
    </div>
  );
}

function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="card-image-link">
        <div className="card-image-wrap">
          <img
            src={getProductImage(product.image, product.title, product.category)}
            alt={product.title}
            className="card-image"
            onError={(event) => {
              event.currentTarget.src = createProductPlaceholder(
                product.title,
                product.category
              );
            }}
          />
          <div className="card-overlay">
            <span className="overlay-text">View Details</span>
          </div>
        </div>
      </Link>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <Link to={`/product/${product._id}`} className="card-title-link">
          <h3 className="card-title">{product.title}</h3>
        </Link>
        <StarRating rating={product.rating} />
        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addItem(product)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const {
    filteredProducts,
    categories,
    activeCategory,
    searchQuery,
    loading,
    error,
    setCategory,
    setSearch,
    refreshProducts,
  } = useProducts();

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">!</div>
        <h2>Unable to load products</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={refreshProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Luxe Store</p>
          <h1 className="hero-title">
            Curated <em>Essentials</em>
          </h1>
          <p className="hero-sub">
            Browse your catalog and keep your store collection polished with product-aware images.
          </p>
          <div className="hero-actions">
            <Link to="/add-product" className="btn btn-primary">
              Add Product
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="deco-ring ring-1" />
          <div className="deco-ring ring-2" />
          <div className="deco-ring ring-3" />
        </div>
      </section>

      <div className="filters-bar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearch(event.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-pills">
          <button
            className={`pill ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`pill ${activeCategory === category ? "active" : ""}`}
              onClick={() => setCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="results-count">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
