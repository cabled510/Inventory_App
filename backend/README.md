# Backend - Inventory Management System

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Inventory Endpoints

#### Get All Items
```http
GET /inventory?search=laptop&category=Electronics&status=In Stock
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### Get Single Item
```http
GET /inventory/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {...}
}
```

#### Create Item
```http
POST /inventory
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Dell XPS 15",
  "category": "Electronics",
  "quantity": 10,
  "price": 1299.99,
  "sku": "DELLXPS15",
  "supplier": "Dell Inc."
}

Response:
{
  "success": true,
  "data": {...}
}
```

#### Update Item
```http
PUT /inventory/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 15,
  "price": 1199.99
}

Response:
{
  "success": true,
  "data": {...}
}
```

#### Delete Item
```http
DELETE /inventory/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Inventory item removed"
}
```

#### Get Statistics
```http
GET /inventory/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalItems": 50,
    "lowStockItems": 5,
    "outOfStockItems": 2,
    "totalValue": 125000.50,
    "categoryBreakdown": [...]
  }
}
```

## Environment Variables

Create a `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

## Technologies Used

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- express-validator - Validation
- cors - CORS handling
- dotenv - Environment variables
