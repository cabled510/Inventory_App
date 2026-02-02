# Deployment Guide

## Prerequisites

- Node.js 16+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)
- Git for version control

## Environment Variables

### Backend (.env)
Copy `.env.example` to `.env` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management  # Or MongoDB Atlas URI
JWT_SECRET=<generate-with-crypto>  # Use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com  # Your deployed frontend URL
```

### Frontend (.env)
Create `.env.production` in frontend folder:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev  # Uses nodemon for hot reload
```

### Frontend
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

## Production Deployment

### Backend Deployment (Node.js)

**Option 1: Traditional Server (VPS, EC2, etc.)**

1. Install dependencies:
```bash
cd backend
npm install --production
```

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name inventory-api
pm2 save
pm2 startup
```

3. Configure reverse proxy (Nginx):
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /path/to/backend/uploads;
        expires 30d;
    }
}
```

**Option 2: Platform-as-a-Service (Heroku, Railway, Render)**

1. Create `Procfile` in backend root:
```
web: node server.js
```

2. Ensure `package.json` has start script:
```json
"scripts": {
  "start": "node server.js"
}
```

3. Set environment variables in platform dashboard

### Frontend Deployment

**Build the app:**
```bash
cd frontend
npm run build
```

**Option 1: Static Hosting (Netlify, Vercel, Cloudflare Pages)**
- Upload `build/` folder
- Set `REACT_APP_API_URL` environment variable
- Configure redirects for SPA routing (see below)

**Option 2: Serve from Backend**

In backend `server.js`, add before routes:
```javascript
// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

### SPA Routing Configuration

**Netlify:** Create `frontend/public/_redirects`:
```
/*  /index.html  200
```

**Vercel:** Create `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Database Setup

### MongoDB Atlas (Recommended for Production)
1. Create cluster at https://cloud.mongodb.com
2. Whitelist IP addresses or allow all (0.0.0.0/0)
3. Create database user
4. Get connection string and update `MONGODB_URI`

### Initial Admin User
```bash
# Register via API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"securepass123"}'

# Connect to MongoDB and promote to admin
mongosh "your-mongodb-uri"
> use inventory_management
> db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
```

## Security Checklist

- ✅ Strong JWT_SECRET generated (128 characters)
- ✅ CORS configured with specific origins
- ✅ Rate limiting enabled (100 req/15min)
- ✅ Helmet.js security headers
- ✅ NoSQL injection prevention
- ✅ .env file in .gitignore
- ⚠️ HTTPS enabled (use Let's Encrypt with Certbot)
- ⚠️ MongoDB authentication enabled
- ⚠️ Regular dependency updates (`npm audit`)

## Monitoring & Logs

**PM2 logs:**
```bash
pm2 logs inventory-api
pm2 monit
```

**Log files:** Morgan automatically logs HTTP requests to console. For file logging, configure:
```javascript
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
```

## Backup Strategy

**MongoDB Backup:**
```bash
# Local
mongodump --uri="mongodb://localhost:27017/inventory_management" --out=/backup/$(date +%Y%m%d)

# Atlas: Use automated backups in dashboard
```

**File Uploads Backup:**
```bash
rsync -av backend/uploads/ /backup/uploads/
```

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection failed:**
- Check MONGODB_URI format
- Verify network access (Atlas IP whitelist)
- Ensure MongoDB service is running

**CORS errors:**
- Update FRONTEND_URL in backend .env
- Verify corsOptions in server.js

**File upload 404:**
- Check `backend/uploads/products/` directory exists
- Verify static file middleware configuration
