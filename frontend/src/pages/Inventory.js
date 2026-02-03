import { useState, useEffect } from 'react';
import api from '../utils/api';
import InventoryForm from '../components/InventoryForm';
import ProductDetailModal from '../components/ProductDetailModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
  });

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/inventory?${params}`);
      setItems(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inventory items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(null);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        fetchItems();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchItems();
  };

  const getStatusBadge = (status) => {
    const badgeClass =
      status === 'In Stock'
        ? 'badge-success'
        : status === 'Low Stock'
        ? 'badge-warning'
        : 'badge-danger';
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  const getImageSrc = (item) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return `${API_URL}${item.image}`;
    return null;
  };

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-subtitle">Manage your products and stock levels</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Products ({items.length})</h2>
          <button onClick={handleAdd} className="btn btn-success">
            <PlusIcon />
            Add Product
          </button>
        </div>

        <div className="search-filters">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Furniture">Furniture</option>
            <option value="Toys">Toys</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {error && <div className="error-message" style={{ margin: '16px' }}>{error}</div>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <PackageIcon />
                      </div>
                      <h3>No products found</h3>
                      <p>Add your first product to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const imageSrc = getImageSrc(item);
                  return (
                    <tr key={item._id} onClick={() => handleView(item)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="product-thumbnail"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="no-image">
                              <PackageIcon />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</div>
                            {item.supplier && (
                              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                {item.supplier}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ 
                          background: 'var(--bg-tertiary)', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                          {item.sku}
                        </code>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}> units</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${item.price.toFixed(2)}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>
                        <div className="actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleView(item)}
                            className="btn btn-ghost btn-small"
                            title="View Details"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-primary btn-small"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="btn btn-danger btn-small"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <InventoryForm
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Inventory;
