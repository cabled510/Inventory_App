import { useState, useEffect } from 'react';
import api from '../utils/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const InventoryForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    sku: '',
    supplier: '',
    imageUrl: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState('url');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
        supplier: item.supplier || '',
        imageUrl: item.imageUrl || '',
      });
      if (item.image) {
        setImagePreview(`${API_URL}${item.image}`);
        setImageType('upload');
      } else if (item.imageUrl) {
        setImagePreview(item.imageUrl);
        setImageType('url');
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    if (url) {
      setImagePreview(url);
      setImage(null);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' });
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (image && imageType === 'upload') {
        submitData.append('image', image);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      if (item) {
        await api.put(`/inventory/${item._id}`, submitData, config);
      } else {
        await api.post('/inventory', submitData, config);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {item ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-control"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., PROD-001"
                  required
                  disabled={!!item}
                />
                {item && <p className="form-hint">SKU cannot be changed</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your product..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Toys">Toys</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  className="form-control"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <div className="image-options">
                <button
                  type="button"
                  className={`image-option ${imageType === 'url' ? 'active' : ''}`}
                  onClick={() => setImageType('url')}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  className={`image-option ${imageType === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageType('upload')}
                >
                  Upload File
                </button>
              </div>

              {imageType === 'url' ? (
                <input
                  type="url"
                  name="imageUrl"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              )}

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <br />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn btn-secondary btn-small"
                    style={{ marginTop: '8px' }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '20px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : item ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;
