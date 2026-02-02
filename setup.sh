#!/bin/bash

echo "======================================"
echo "Inventory Management System Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Check if MongoDB is installed or provide instructions
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not detected locally${NC}"
    echo "Options:"
    echo "1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/"
    echo "2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

# Final Instructions
echo ""
echo -e "${GREEN}======================================"
echo "Setup Complete!"
echo "======================================${NC}"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure Backend:"
echo "   - Edit backend/.env with your MongoDB URI and JWT secret"
echo ""
echo "2. Start MongoDB (if local):"
echo "   mongod"
echo ""
echo "3. Start Backend (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "5. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
