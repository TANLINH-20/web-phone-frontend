import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const DashboardUpdateProduct = () => {
  const [state, setState] = useState({
    name: "",
    category_id: "",
    brand: "",
    description: "",
    details: "",
    photos: null,
    price: "",
    size: "",
    color: "",
    quantity: 1,
    success: false,
    error: "",
    errorKeys: "",
    categories: [],
  });

  const { id } = useParams(); // Get id from route params
  const navigate = useNavigate();
  useEffect(() => {
    getCategories();
    getProductDetails();
  }, []);

  const getCategories = () => {
    axios
      .get("http://127.0.0.1:8000/api/product/categories")
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          category_id: response.data[0].id,
          categories: [...response.data],
        }));
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  const getProductDetails = () => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const product = response.data;
        setState((prevState) => ({
          ...prevState,
          name: product.name,
          category_id: product.category_id,
          brand: product.brand,
          description: product.description,
          details: product.details,
          price: product.price,
          size: product.stocks[0].size,
          color: product.stocks[0].color,
          quantity: product.stocks[0].quantity,
        }));
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    if(state.photos != null){
      Array.from(state.photos).forEach(photo => fd.append('photos[]', photo))
    }
    fd.append("name", state.name);
    fd.append("category_id", state.category_id);
    fd.append("brand", state.brand);
    fd.append("description", state.description);
    fd.append("details", state.details);
    fd.append("price", state.price);
    fd.append("size", state.size);
    fd.append("color", state.color);
    fd.append("quantity", state.quantity);

    axios
      .post(`http://127.0.0.1:8000/api/product/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setState({
          ...state,
          success: true,
        });
        console.log(response)
        toast.success("Product updated successfully");
        getCategories();
        navigate("/dashboard/products");
      })
      .catch((err) => {
        console.error(err);
        setState({
          ...state,
          error: err.response?.data?.errors || "An error occurred",
        });
        toast.error("Failed to update product");
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (state.success) {
      setState((prevState) => ({
        ...prevState,
        success: false,
      }));
    }
  };

  const fileSelectHandler = (event) => {
    setState((prevState) => ({
      ...prevState,
      photos: event.target.files,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Update Product</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="d-flex">
              <div className="col-xl-6">
                <div className="form-group me-3">
                  <label className="small mb-1">Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="form-group me-3">
                  <label className="small mb-1">Category</label>
                  <select
                    className="form-control"
                    value={state.category_id}
                    onChange={handleChange}
                    name="category_id"
                  >
                    {state.categories &&
                      state.categories.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group me-3">
                  <label className="small mb-1">Brand</label>
                  <input
                    className="form-control"
                    name="brand"
                    value={state.brand}
                    onChange={handleChange}
                    type="text"
                    placeholder="Product brand"
                    required
                  />
                </div>
                <div className="form-group me-3">
                  <label className="small mb-1">Price</label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">$</div>
                    </div>
                    <input
                      className="form-control"
                      name="price"
                      value={state.price}
                      onChange={handleChange}
                      type="text"
                      placeholder="Product price"
                      required
                    />
                  </div>
                </div>
                <div className="form-group me-3">
                  <label className="small mb-1">Upload Photo(s)</label>
                  <input
                    className="form-control"
                    onChange={fileSelectHandler}
                    type="file"
                    multiple
                    style={{ paddingTop: "3px" }}
                  />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="form-group me-3">
                  <label className="small mb-1">Description</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    placeholder="Product description"
                    required
                  />
                </div>
                <div className="form-group me-3">
                  <label className="small mb-1">Details</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    name="details"
                    value={state.details}
                    onChange={handleChange}
                    placeholder="Product details"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group me-3 col-md-5">
                    <label className="small mb-1">Size</label>
                    <input
                      className="form-control"
                      type="text"
                      name="size"
                      placeholder="Product size"
                      onChange={handleChange}
                      value={state.size}
                      required
                    />
                  </div>
                  <div className="form-group me-3 col-md-5">
                    <label className="small mb-1">Color</label>
                    <input
                      className="form-control"
                      type="text"
                      name="color"
                      placeholder="Product color"
                      onChange={handleChange}
                      value={state.color}
                      required
                    />
                  </div>
                  <div className="form-group me-3 col-md-2">
                    <label className="small mb-1">Quantity</label>
                    <input
                      className="form-control"
                      type="number"
                      name="quantity"
                      onChange={handleChange}
                      value={state.quantity}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button className="btn btn-primary float-right">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpdateProduct;
