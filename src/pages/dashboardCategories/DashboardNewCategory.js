import axios from "axios";
import React, { Component } from "react";
import toast from "react-hot-toast";

class DashboardNewCategory extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      success: false,
      error: "",
    };

    this.baseState = this.state;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this); // Bind handleChange
  }

  handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", this.state.name);
    console.log(this.state)
    axios
      .post("http://127.0.0.1:8000/api/product/category", fd)
      .then((response) => {
        this.setState({
          ...this.baseState,
          success: true,
        });
        toast.success('Category Added Successfully')
      })
      .catch((err) => {
        this.setState({
          error: err.response.data.errors,
        });
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });

    if (this.state.success) {
      this.setState({
        success: false,
      });
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Add a New Category
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              <div className="d-flex">
                <div className="col-xl-12">
                  <div className="form-group me-3">
                    <label className="small mb-1">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={this.state.name} // Add value prop
                      onChange={this.handleChange}
                      type="text"
                      placeholder="Category name"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <button className="btn btn-primary mt-3 float-right">
                  Create category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardNewCategory;