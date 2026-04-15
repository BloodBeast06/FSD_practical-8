import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import { seedProducts } from "../data/seedProducts.js";

dotenv.config();

async function seed() {
  await connectDB(process.env.MONGODB_URI);
  await Product.deleteMany();
  await Product.insertMany(seedProducts);
  console.log("Seed data inserted");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
