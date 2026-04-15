import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import {
  createProductPlaceholder,
  getProductImage,
} from "../utils/productImage";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const initialFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "1",
  imageUrl: "",
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function AddProduct() {
  const { createProduct } = useProducts();
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitState, setSubmitState] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const previewImage = useMemo(
    () =>
      imagePreview ||
      getProductImage(formData.imageUrl, formData.title, formData.category),
    [formData.category, formData.imageUrl, formData.title, imagePreview]
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));

    if (name === "imageUrl" && value.trim()) {
      setImageFile(null);
      setImagePreview("");
    }
  }

  async function handleImageFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitState({
        loading: false,
        message: "",
        error: "Please choose a valid image file.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSubmitState({
        loading: false,
        message: "",
        error: "Image must be smaller than 2 MB.",
      });
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageFile(file);
      setImagePreview(dataUrl);
      setFormData((current) => ({ ...current, imageUrl: "" }));
      setSubmitState({ loading: false, message: "", error: "" });
    } catch (error) {
      setSubmitState({
        loading: false,
        message: "",
        error: error.message || "Unable to read the selected image.",
      });
    }
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    setSubmitState({ loading: true, message: "", error: "" });

    try {
      await createProduct({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: imagePreview || formData.imageUrl.trim(),
      });

      setFormData(initialFormData);
      setImageFile(null);
      setImagePreview("");
      setSubmitState({
        loading: false,
        message: "Product saved successfully.",
        error: "",
      });
    } catch (submitError) {
      setSubmitState({
        loading: false,
        message: "",
        error:
          submitError.response?.data?.message || "Unable to add product right now.",
      });
    }
  }

  return (
    <div className="add-product-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Add Product</span>
      </div>

      <section className="form-page-shell">
        <div className="product-form-card">
          <div className="form-page-copy">
            <p className="hero-eyebrow">Luxe Store Catalog</p>
            <h1 className="form-section-title">Add a new product</h1>
            <p className="hero-sub">
              Save products to your store with either an image URL or a local upload.
            </p>
          </div>

          <div className="product-form-layout">
            <form className="product-form-grid" onSubmit={handleAddProduct}>
              <div className="form-group half">
                <label className="form-label" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label className="form-label" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label className="form-label" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste an image URL or use the upload below"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="imageFile">
                  Upload Image
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="form-input form-file-input"
                  onChange={handleImageFileChange}
                />
                <span className="form-hint">
                  JPG, PNG, WEBP up to 2 MB. Local uploads are stored with the product.
                </span>
                {imageFile && (
                  <span className="form-hint">
                    Selected file: {imageFile.name}
                  </span>
                )}
              </div>
              {submitState.message && (
                <p className="form-success">{submitState.message}</p>
              )}
              {submitState.error && <p className="form-error">{submitState.error}</p>}
              <div className="product-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitState.loading}
                >
                  {submitState.loading ? "Saving Product..." : "Save Product"}
                </button>
                <Link to="/" className="btn btn-outline">
                  Back to Shop
                </Link>
              </div>
            </form>

            <aside className="product-preview-card">
              <span className="form-label">Preview</span>
              <div className="product-preview-image-wrap">
                <img
                  src={previewImage}
                  alt={formData.title || "Product preview"}
                  className="card-image"
                  onError={(event) => {
                    event.currentTarget.src = createProductPlaceholder(
                      formData.title,
                      formData.category
                    );
                  }}
                />
              </div>
              <h2 className="preview-title">{formData.title || "New Luxe Product"}</h2>
              <p className="preview-category">{formData.category || "Curated Collection"}</p>
              <p className="preview-price">
                ${Number(formData.price || 0).toFixed(2)}
              </p>
              <p className="preview-copy">
                {formData.description ||
                  "Products without their own image will automatically receive a Luxe Store placeholder."}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
