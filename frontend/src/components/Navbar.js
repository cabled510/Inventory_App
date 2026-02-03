import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Inventory App
        </Link>
        {user && (
          <div className="navbar-menu">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/inventory" className={isActive('/inventory') ? 'active' : ''}>
              Products
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
            )}
            <div className="navbar-user">
              <span>
                {user.username}
                {user.role === 'admin' && (
                  <span className="role-badge admin">Admin</span>
                )}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-small">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
