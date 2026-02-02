@echo off
echo ======================================
echo Inventory Management System Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js is installed
node -v

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [✓] .env file created
    echo [!] Please update .env with your configuration
) else (
    echo [✓] .env file already exists
)

echo Installing backend dependencies...
call npm install
echo [✓] Backend dependencies installed

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend

echo Installing frontend dependencies...
call npm install
echo [✓] Frontend dependencies installed

cd ..

REM Final Instructions
echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next Steps:
echo.
echo 1. Configure Backend:
echo    - Edit backend\.env with your MongoDB URI and JWT secret
echo.
echo 2. Start MongoDB (if local):
echo    mongod
echo.
echo 3. Start Backend (in one terminal):
echo    cd backend
echo    npm run dev
echo.
echo 4. Start Frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo 5. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo Happy coding! 🚀
pause
