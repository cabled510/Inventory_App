import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <div className="error-message" style={{ margin: 0, borderRadius: '8px' }}>
            <h2>⛔ Access Denied</h2>
            <p>You do not have permission to access this page. Admin privileges are required.</p>
            <a href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
