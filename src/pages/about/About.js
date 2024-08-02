import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container my-5">
      <div id="breadcrumb" className="section">
        <div className="section-title">
          <h3 className="breadcrumb-header">Thông tin</h3>
          <ul className="breadcrumb-tree">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li className="active">About</li>
          </ul>
        </div>
      </div>
      <h1 className="mb-4">Về chúng tôi</h1>
      <p className="lead">
        Chúng tôi là một công ty chuyên về E-commerce. 
        Được thành lập vào năm {new Date().getFullYear()}, chúng tôi đã không ngừng 
        phát triển và cung cấp các sản phẩm/dịch vụ chất lượng cao 
        cho khách hàng.
      </p>
      <h2 className="mt-4">Sứ mệnh</h2>
      <p>
        Sứ mệnh của chúng tôi là phát triển E-commerce.
      </p>
      <h2 className="mt-4">Tầm nhìn</h2>
      <p>
        Chúng tôi hướng tới một tương lai mới.
      </p>
      <h2 className="mt-4">Giá trị cốt lõi</h2>
      <ul className="list-group">
        <li className="list-group-item">Chất lượng</li>
        <li className="list-group-item">Sáng tạo</li>
        <li className="list-group-item">Trách nhiệm</li>
        <li className="list-group-item">Khách hàng là trọng tâm</li>
      </ul>
    </div>
  );
}

export default About;