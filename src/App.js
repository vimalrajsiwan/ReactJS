import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:5108/api'; // Update with your API endpoint

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [validationError1, setValidationError1] = useState({});
  const [validationError2, setValidationError2] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    }
  };

  const validateProduct = (product) => {
    let isValid = true;
    const errors = {};

    if (!product.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!product.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!product.price) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(product.price) || product.price <= 0) {
      errors.price = 'Price must be a positive number';
      isValid = false;
    }

    // setValidationError(errors);
    return {isValid,errors};
  };

  const addProduct = async () => {
    const {isValid, errors} = validateProduct(newProduct);
    if (!isValid) {
      setValidationError1(errors);
      return;
    }
    setValidationError1({});

    try {
      const response = await axios.post(`${API_BASE_URL}/products`, newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: '' });
    } catch (error) {
      setError('Error adding product: ' + error.message);
    }
  };

  const onCancelAdd = () => {
    setNewProduct({ name: '', description: '', price: '' });
    setValidationError1({});
  }

  const onCancelEdit = () => {
    setEditingProduct(null);
    setValidationError2({});
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      setError('Error deleting product: ' + error.message);
    }
  };

  const editProduct = async (id, updatedProduct) => {

    const {isValid, errors} = validateProduct(updatedProduct);
    if (!isValid) {
      setValidationError2(errors);
      return;
    }

    setValidationError2({});

    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, updatedProduct);
      const updatedProducts = products.map(product => 
        product.id === id ? response.data : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      setError('Error updating product: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Product Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <h2>Add New Product</h2>
        <div className="row">
          <div className="col-sm-3">
            <input className={`form-control mb-2 ${validationError1.name && 'is-invalid'}`} type="text" placeholder="Name" value={newProduct.name} 
                   onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            {validationError1.name && <div className="invalid-feedback">{validationError1.name}</div>}
          </div>
          <div className="col-sm-4">
            <input className={`form-control mb-2 ${validationError1.description && 'is-invalid'}`} type="text" placeholder="Description" value={newProduct.description} 
                   onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            {validationError1.description && <div className="invalid-feedback">{validationError1.description}</div>}
          </div>
          <div className="col-sm-2">
            <input className={`form-control mb-2 ${validationError1.price && 'is-invalid'}`} type="number" placeholder="Price" value={newProduct.price} 
                   onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            {validationError1.price && <div className="invalid-feedback">{validationError1.price}</div>}
          </div>
          <div className="col-sm-3">
            <button className="btn btn-primary mb-2" onClick={addProduct}>Add Product</button>
            <button className="btn btn-secondary mb-2 ml-2" onClick={onCancelAdd}>Cancel</button>
          </div>
        </div>
      </div>
      <div className='table-responsive-md'>
        <h2>Products</h2>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <button className="btn btn-sm btn-info mr-2" onClick={() => setEditingProduct(product)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <div className="mb-4">
          <h2>Edit Product</h2>
          <div className="row">
            <div className="col-sm-3">
              <input className={`form-control mb-2 ${validationError2.name && 'is-invalid'}`} type="text" placeholder="Name" value={editingProduct.name} 
                     onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              {validationError2.name && <div className="invalid-feedback">{validationError2.name}</div>}
            </div>
            <div className="col-sm-4">
              <input className={`form-control mb-2 ${validationError2.description && 'is-invalid'}`} type="text" placeholder="Description" value={editingProduct.description} 
                     onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              {validationError2.description && <div className="invalid-feedback">{validationError2.description}</div>}
            </div>
            <div className="col-sm-2">
              <input className={`form-control mb-2 ${validationError2.price && 'is-invalid'}`} type="number" placeholder="Price" value={editingProduct.price} 
                     onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} />
              {validationError2.price && <div className="invalid-feedback">{validationError2.price}</div>}
            </div>
            <div className="col-sm-3">
              <button className="btn btn-primary mb-2" onClick={() => editProduct(editingProduct.id, editingProduct)}>Save</button>
              <button className="btn btn-secondary mb-2 ml-2" onClick={onCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;