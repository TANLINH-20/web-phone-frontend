import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardUpdateCategory = () => {
  const [category, setCategory] = useState({
    id: '',
    name: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryDetails();
  }, []);

  const getCategoryDetails = () => {
    axios.get(`http://127.0.0.1:8000/api/product/category/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(response => {
        const fetchedCategory = response.data;
        setCategory({
          id: fetchedCategory.id,
          name: fetchedCategory.name,
        });
      })
      .catch(err => {
        console.error('Error fetching category details:', err);
        toast.error('Failed to fetch category details');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
  
    axios.put(`http://127.0.0.1:8000/api/product/categories/${category.id}`, 
      { name: category.name }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        setSuccess(true);
        toast.success(response.data.message || 'Category updated successfully');
        navigate('/dashboard/categories'); // Ensure this route is correct
      })
      .catch(err => {
        if (err.response && err.response.data) {
          if (err.response.data.errors && err.response.data.errors.name) {
            setError(err.response.data.errors.name[0]);
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError('An error occurred while updating the category.');
          }
        } else {
          setError('Network error. Please try again.');
        }
        toast.error('Failed to update category');
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategory(prevCategory => ({
      ...prevCategory,
      [name]: value
    }));
    if (success) setSuccess(false);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Update Category</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="small mb-1">Name</label>
              <input 
                className="form-control" 
                name="name" 
                value={category.name} 
                onChange={handleChange} 
                type="text" 
                placeholder="Category name" 
                required 
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
              <button className="btn btn-primary float-right mt-3">Update Category</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpdateCategory;