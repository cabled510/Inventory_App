# Frontend - Inventory Management System

React-based frontend for the Inventory Management System.

## Features

- User authentication (Login/Register)
- Dashboard with statistics
- Inventory listing with search and filters
- Add/Edit/Delete inventory items
- Responsive design
- Protected routes

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── InventoryForm.js    # Modal form for add/edit
│   ├── Navbar.js           # Navigation component
│   └── PrivateRoute.js     # Route protection
├── context/
│   └── AuthContext.js      # Authentication state management
├── pages/
│   ├── Dashboard.js        # Statistics and overview
│   ├── Inventory.js        # Inventory list and management
│   ├── Login.js            # Login page
│   └── Register.js         # Registration page
├── utils/
│   └── api.js              # Axios configuration
├── App.js                  # Main app component
├── index.js                # Entry point
└── index.css               # Global styles
```

## API Configuration

The frontend connects to the backend API at `http://localhost:5000/api` by default. This is configured through the proxy setting in `package.json`.

For production, set the `REACT_APP_API_URL` environment variable.

## Technologies Used

- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS for styling

## Available Pages

- `/login` - User login
- `/register` - User registration
- `/` - Dashboard (protected)
- `/inventory` - Inventory management (protected)

## Authentication

The app uses JWT tokens stored in localStorage. The token is automatically attached to API requests via Axios interceptors.
