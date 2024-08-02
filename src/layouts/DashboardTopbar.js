import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardTopbar = () => {
  const [user, setUser] = useState({ name: "" });
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAuth(token);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getAuth = (token) => {
    axios
      .get("http://127.0.0.1:8000/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setUser(result.data.user);
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-light mt-3">
      <div className="container-fluid">
        <button
          className="btn btn-link d-md-none rounded-circle me-3"
          id="sidebarToggleTop"
        >
          <i className="bi bi-list"></i>
        </button>

        <form className="d-none d-sm-inline-block form-inline me-auto ms-md-3 my-2 my-md-0 mw-100">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for..."
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              id="button-addon2"
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown me-3">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span>
          </li>

          <li className="position-relative">
            <Link
              className={`text-dark ${
                openMenu === "orders" ? "active" : ""
              } p-1`}
              onClick={() => toggleMenu("orders")}
            >
              <span className="d-none d-lg-inline me-2 text-gray-600 small">
                {user.name}
              </span>
              <i
                className={`bi bi-chevron-${
                  openMenu === "orders" ? "up" : "down"
                } ms-auto`}
              ></i>
            </Link>
            <div
              className={`collapse ${
                openMenu === "orders" ? "show" : ""
              } shadow-lg p-3 mb-5 bg-body-tertiary rounded border position-absolute`} style={{top:"35px", left:'-44px', zIndex:'1'}}
            >
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li className="mt-2">
                  <Link className="dropdown-item">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </li>
                <li className="mt-2">
                  <Link className="dropdown-item">
                    <i className="bi bi-gear me-2"></i>Settings
                  </Link>
                </li>
                <li className="mt-2">
                  <Link className="dropdown-item">
                    <i className="bi bi-list-check me-2"></i>Activity Log
                  </Link>
                </li>
                <li className="mt-2">
                  <hr />
                </li>
                <li className="mt-2">
                  <Link to={'/'} className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashboardTopbar;
