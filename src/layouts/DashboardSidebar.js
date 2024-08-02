import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
const DashboardSidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: '280px', minHeight: '100vh'}}>
      <Link to="/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <img src={require('../assets/img/logo.png')} alt="logo" className="me-2 p-0 img-fluid" style={{maxWidth: '200px'}} />
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : 'text-white'}`}>
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </li>
        <li className='mb-2'>
          <Link 
            className={`nav-link text-white ${openMenu === 'products' ? 'active' : ''} `} 
            onClick={() => toggleMenu('products')}
          >
            <i className="bi bi-box-seam me-2"></i>
            Products
            <i className={`bi bi-chevron-${openMenu === 'products' ? 'up' : 'down'} ms-auto`}></i>
          </Link>
          <div className={`collapse ${openMenu === 'products' ? 'show' : ''} mt-2`}>
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li className='ms-3'><Link to="/dashboard/products" className={`nav-link ${isActive('/dashboard/products') ? 'active' : 'text-white'}`}>All Products</Link></li>
              <li className='ms-3'><Link to="/dashboard/new-product" className={`nav-link ${isActive('/dashboard/new-product') ? 'active' : 'text-white'}`}>New Product</Link></li>
            </ul>
          </div>
        </li>
        <li className='mb-2'>
          <Link 
            className={`nav-link text-white ${openMenu === 'orders' ? 'active' : ''}`} 
            onClick={() => toggleMenu('orders')}
          >
            <i className="bi bi-list-check me-2"></i>
            Categories
            <i className={`bi bi-chevron-${openMenu === 'orders' ? 'up' : 'down'} ms-auto`}></i>
          </Link>
          <div className={`collapse ${openMenu === 'orders' ? 'show' : ''} mt-2`}>
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li className='ms-3'><Link to="/dashboard/categories" className={`nav-link ${isActive('/dashboard/categories') ? 'active' : 'text-white'}`}>Categories</Link></li>
              <li  className='ms-3'><Link to="/dashboard/new-category" className={`nav-link ${isActive('/dashboard/new-category') ? 'active' : 'text-white'}`}>New Category</Link></li>
              </ul>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default DashboardSidebar