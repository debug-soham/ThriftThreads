# MongoDB Backend

Node.js/Express backend with MongoDB for the ThriftThreads e-commerce platform.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` if using MongoDB Atlas or a different connection string

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

1. From the root directory, install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:8081

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Database Models

### Product Schema
- name, brand, price, originalPrice
- images, category, condition, size
- gender, color, fabric, measurements
- description, styleSuggestions
- inStock, featured, newArrival
- sustainabilityScore

### Order Schema
- orderNumber (auto-generated)
- items (array of order items)
- subtotal, shippingCost, taxAmount, total
- status, paymentStatus, paymentMethod
- shippingAddress, billingAddress
- notes, userId

## Notes

- Created Express REST API with MongoDB
- MongoDB schemas optimized for e-commerce
- Product data can be seeded using `npm run seed`
