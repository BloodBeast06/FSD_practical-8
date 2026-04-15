import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      image,
      stock,
      rating,
    } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Title, description, price, and category are required",
      });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      image: image?.trim() || undefined,
      stock: Number.isFinite(Number(stock)) ? Number(stock) : 1,
      rating: {
        rate: Number.isFinite(Number(rating?.rate)) ? Number(rating.rate) : 4,
        count: Number.isFinite(Number(rating?.count)) ? Number(rating.count) : 1,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});

export default router;
