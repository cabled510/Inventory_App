const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// SVG Icons
const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ProductDetailModal = ({ item, onClose, onEdit }) => {
  if (!item) return null;

  const getImageSrc = () => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return `${API_URL}${item.image}`;
    return null;
  };

  const imageSrc = getImageSrc();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Product Details</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          <div className="product-detail">
            <div className="product-detail-header">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={item.name} 
                  className="product-detail-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="product-detail-image-placeholder" 
                style={{ display: imageSrc ? 'none' : 'flex' }}
              >
                <PackageIcon />
              </div>
              
              <div className="product-detail-info">
                <h2>{item.name}</h2>
                <p className="product-detail-sku">SKU: {item.sku}</p>
                <p className="product-detail-price">${item.price.toFixed(2)}</p>
                {getStatusBadge(item.status)}
              </div>
            </div>

            <div className="product-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">{item.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quantity in Stock</span>
                <span className="detail-value">{item.quantity} units</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Value</span>
                <span className="detail-value">${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Supplier</span>
                <span className="detail-value">{item.supplier || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">{formatDate(item.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDate(item.lastUpdated || item.updatedAt)}</span>
              </div>
            </div>

            <div className="product-detail-description">
              <h4>Description</h4>
              <p>{item.description}</p>
            </div>

            {item.createdBy && (
              <div className="product-detail-description">
                <h4>Created By</h4>
                <p>{item.createdBy.username} ({item.createdBy.email})</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={() => onEdit(item)} className="btn btn-primary">
            <EditIcon />
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
