import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

// SVG Icons
const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/inventory/stats');
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message" style={{ margin: '2rem' }}>{error}</div>;

  return (
    <div className="dashboard container">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.username || 'User'}
        </h1>
        <p className="page-subtitle">Here's an overview of your inventory</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-primary-muted)', color: 'var(--accent-primary)' }}>
            <PackageIcon />
          </div>
          <div className="stat-info">
            <h3>{stats?.totalItems || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-muted)', color: 'var(--warning)' }}>
            <AlertIcon />
          </div>
          <div className="stat-info">
            <h3>{stats?.lowStockItems || 0}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-muted)', color: 'var(--danger)' }}>
            <XCircleIcon />
          </div>
          <div className="stat-info">
            <h3>{stats?.outOfStockItems || 0}</h3>
            <p>Out of Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-muted)', color: 'var(--success)' }}>
            <DollarIcon />
          </div>
          <div className="stat-info">
            <h3>${stats?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {/* Category Breakdown */}
        {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Category Breakdown</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Total Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.categoryBreakdown.map((category) => (
                    <tr key={category._id} style={{ cursor: 'default' }}>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{category._id}</span>
                      </td>
                      <td>{category.count}</td>
                      <td>{category.totalQuantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/inventory" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                View All Products
              </Link>
              <Link to="/inventory" className="btn btn-success" style={{ justifyContent: 'flex-start' }}>
                Add New Product
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  Admin Panel
                </Link>
              )}
            </div>

            {(stats?.lowStockItems > 0 || stats?.outOfStockItems > 0) && (
              <div className="alert-box warning">
                <h4>Attention Required</h4>
                <p>
                  You have {stats?.lowStockItems || 0} low stock items and {stats?.outOfStockItems || 0} out of stock items that may need restocking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
