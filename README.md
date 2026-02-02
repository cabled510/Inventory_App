# Inventory Management System

Full-stack MERN application for managing inventory with user authentication and role-based access control.

## Features

- 🔐 JWT Authentication with secure token management
- 👥 Role-based access control (User/Admin)
- 📦 Complete inventory CRUD operations
- 🖼️ Image upload support for products
- 🔍 Search and filter functionality
- 📊 Dashboard with statistics
- 🛡️ Production-ready security (Helmet, Rate Limiting, NoSQL injection prevention)

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Inventory_App
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment:
```bash
# Copy example env file
cd backend
cp .env.example .env

# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Update JWT_SECRET in .env with the generated string
```

4. Start development servers:
```bash
# Terminal 1 - Backend (from /backend)
npm run dev

# Terminal 2 - Frontend (from /frontend)
npm start
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000/api

## Project Structure

```
Inventory_App/
├── backend/                # Express REST API
│   ├── config/            # Database connection
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth, validation, upload, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # User-uploaded product images
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context/state
│   │   ├── pages/        # Page components
│   │   └── utils/        # API client, helpers
│   └── public/
└── DEPLOYMENT.md         # Production deployment guide
```

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

### Main Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/inventory` - Get all inventory items (supports search/filter)
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=<generated-secure-string>
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Creating First Admin User

1. Register via the UI or API
2. Connect to MongoDB and run:
```javascript
db.users.updateOne(
  {email: "admin@example.com"}, 
  {$set: {role: "admin"}}
)
```

## Security Features

- ✅ Helmet.js security headers
- ✅ Rate limiting (100 req/15min)
- ✅ NoSQL injection prevention
- ✅ CORS whitelist configuration
- ✅ JWT with secure secrets
- ✅ Password hashing with bcrypt
- ✅ Request logging

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions including:
- VPS/Cloud platform deployment
- MongoDB Atlas setup
- Nginx configuration
- PM2 process management
- Frontend build and hosting options

## Tech Stack

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer (file uploads)
- Express-validator

**Frontend:**
- React 18
- React Router v6
- Axios
- Context API
- CSS3

## Development

### Backend Scripts
```bash
npm start       # Production mode
npm run dev     # Development with nodemon
```

### Frontend Scripts
```bash
npm start       # Development server
npm run build   # Production build
npm test        # Run tests
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create an issue in the repository.
