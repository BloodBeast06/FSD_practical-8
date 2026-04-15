# Practical 8 - MERN Store

This project converts the Practical 7 React storefront into a MERN application.

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Node.js + Express + MongoDB backend

## Features

- Product listing from MongoDB
- Product details page
- Cart management with React Context
- Checkout form with validation
- Order creation through Express API
- MongoDB seed script for sample products

## Backend Setup

1. Open `server/.env.example`
2. Copy it to `server/.env`
3. Set your MongoDB connection string

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/practical8_store
CLIENT_URL=http://localhost:5173
```

## Run Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

## Run Frontend

```bash
cd client
npm install
npm run dev
```

## API Endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
