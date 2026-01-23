# ThriftThreads - Sustainable Pre-Loved Fashion

India's premium destination for curated pre-loved fashion. Full-stack e-commerce platform with React frontend, Express API, and MongoDB.

---

## Features

- Product browsing with filters (category, condition, price)
- Shopping cart & wishlist
- User authentication & order history
- Admin dashboard (products, orders, analytics)
- Responsive design (mobile, tablet, desktop)

---

## Prerequisites

- **Node.js** - [Download LTS](https://nodejs.org/en/download)
- **MongoDB** - [Download Community](https://www.mongodb.com/try/download/community)

---

## Quick Start

```bash
# Clone repo
git clone https://github.com/debug-soham/ThriftThreads.git
cd ThriftThreads

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install
```

### Run Both Services

**Terminal 1 - Backend (Port 3001):**
```bash
cd backend
npm run seed     # (Optional) Seed sample products
npm start
```

**Terminal 2 - Frontend (Port 8080):**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:8080

---

## Admin Access

1. Create admin user:
   ```bash
   cd backend
   node src/create-admin.js
   ```

2. **Default Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

3. Login at http://localhost:8080/admin

4. Manage products, orders, and view analytics

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui, React Router v6

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth

---

## Useful Commands

```bash
# Backend
npm start                 # Start server
npm run dev               # Start with auto-reload (nodemon)
npm run seed              # Seed sample products
npm run reset:orders      # Clear all orders
node src/create-admin.js  # Create admin user

# Frontend
npm run dev               # Start dev server
npm run build             # Build for production
```

---

## API Base

`http://localhost:3001/api`

Routes: `/products`, `/orders`, `/auth`

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
