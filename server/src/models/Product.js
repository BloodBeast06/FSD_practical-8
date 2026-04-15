import mongoose from "mongoose";

const DEFAULT_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='600' height='450' fill='%23f4ede3'/><circle cx='300' cy='180' r='70' fill='%23d8c3a5'/><rect x='170' y='270' width='260' height='24' rx='12' fill='%23b89b72'/><rect x='210' y='315' width='180' height='18' rx='9' fill='%239b8160'/><text x='300' y='95' text-anchor='middle' font-family='Arial' font-size='28' fill='%236c5946'>No Image</text></svg>";

const ratingSchema = new mongoose.Schema(
  {
    rate: { type: Number, required: true, min: 0, max: 5 },
    count: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: {
      type: String,
      trim: true,
      default: DEFAULT_PRODUCT_IMAGE,
    },
    rating: { type: ratingSchema, required: true },
    stock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
