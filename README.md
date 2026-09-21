# LUMA — luxury beauty marketplace

A polished Cloud Computing college demonstration: a React storefront, an Express REST API, and a MongoDB-ready persistence boundary. It ships with a graceful browser-first demo mode, so it works immediately without cloud credentials.

## Project structure

```text
make/
├── frontend/                       # Vite + React customer storefront
│   ├── public/assets/editorial-hero.png
│   └── src/
│       ├── data/product-catalog.js # Canonical 20-product demo catalogue
│       ├── storefront-app.jsx      # React entry point and composed UI
│       └── styles.css              # Responsive luxury design system
├── backend/
│   └── src/                        # Express API and MongoDB/Mongoose model layer
│       ├── api-server.js           # API routes and server startup
│       └── database-models.js      # MongoDB/Mongoose schemas
├── package.json                    # Root concurrent development command
└── README.md
```

## Features

- Four collections: M·A·C, Fenty Beauty, K-Beauty and Rare Beauty.
- Exactly 20 products, exactly 5 functional shade swatches per product (100 product–shade choices).
- Search includes product, brand, category and shade names; working brand/category/price/rating filters and sort order.
- Product modal with ingredients, benefits and three reviews; selected shades are required before adding to bag.
- Persistent bag, wishlist and demo session via `localStorage`.
- Quantity controls, automatic INR totals, demo checkout and unique order confirmation.
- Responsive mobile nav, drawer cart, visual state feedback, and high-end editorial styling.

## Install and run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run install:all
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The API runs at `http://localhost:5000`.

To run independently:

```bash
npm run dev --prefix frontend
npm run dev --prefix backend
```

`VITE_API_URL` is optional. When set, the React app requests `GET /api/products`; if the API is unavailable, it falls back to the same local canonical sample catalogue so the assignment demo remains usable.

## Environment variables and database

`backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/maison-muse
```

Create a free MongoDB Atlas cluster, create a database user, allow your deployment IP, and substitute the connection string. The current server connects when `MONGODB_URI` is supplied and deliberately operates in demo mode otherwise. For production persistence, map these Mongoose collections from the documented schema:

| Collection | Core fields |
|---|---|
| Users | user_id, name, email, password_hash |
| Brands | brand_id, brand_name, description, image |
| Products | product_id, brand_id, product_name, category, price, description, rating, image |
| Shades | shade_id, product_id, shade_name, shade_hex |
| Cart | cart_id, user_id, product_id, shade_id, quantity |
| Wishlist | user_id, product_id |
| Orders / OrderItems | order_id, user_id, total, status, created_at; product_id, shade_id, quantity, price |
| Reviews | review_id, product_id, user_id, rating, review_text |

Never commit `.env` files or database credentials.

## REST API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check and current API mode |
| GET | `/api/products` | All 20 product records, including five shades and reviews |
| GET | `/api/products/:id` | One product |
| GET | `/api/brands` | Brand list |
| GET | `/api/categories` | Category list |
| POST | `/api/cart` | Demo cart persistence endpoint |
| POST | `/api/orders` | Creates a demo order ID |
| GET | `/api/orders/:id` | Gets a demo order status |

Example checkout request:

```json
POST /api/orders
{ "customer": { "name": "Aanya" }, "items": [{ "productId": "p1", "shade": "Medium", "quantity": 1 }], "total": 4098 }
```

## Deployment guide

1. Push this folder to GitHub.
2. Deploy `backend/` to Render, Railway, Azure App Service, AWS Elastic Beanstalk, or Google Cloud Run. Set `PORT` and `MONGODB_URI` in the provider's secret/environment panel.
3. Deploy `frontend/` to Vercel, Netlify, Cloudflare Pages, or an S3 + CloudFront static site. Build command: `npm run build --prefix frontend`; publish directory: `frontend/dist`.
4. Set `VITE_API_URL` in the frontend host to the deployed API URL, then redeploy the frontend.
5. In production, restrict CORS to the deployed frontend origin and store secrets in the provider's secret manager.

## Cloud Computing concepts demonstrated

The design separates presentation (React CDN/static host), application/API (stateless Express container), and data (MongoDB Atlas managed database). This makes the API independently scalable, permits CDN caching of static assets, supports CI/CD deployments per layer, and keeps configuration/credentials outside source control. The health endpoint enables basic load-balancer checks, while cloud environment variables make the same artifact portable between local development and production.
