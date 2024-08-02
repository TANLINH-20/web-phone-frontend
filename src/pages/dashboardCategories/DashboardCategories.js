import React, { Component } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";

import { Link } from "react-router-dom";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

class DashboardCategories extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      currentPage: 1,
      perPage: 0,
      total: 0,
      categories: [],
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getCategories(this.state.currentPage);
  }

  getCategories(pageNumber) {
    axios
      .get(`http://127.0.0.1:8000/api/product/category?page=${pageNumber}`)
      .then((result) => {
        this.setState({
          currentPage: result.data.current_page,
          perPage: result.data.per_page,
          total: result.data.total,
          categories: [...result.data.data],
          loading: false,
        });
      });
  }

  handleDelete() {
    let page = this.state.currentPage;

    if ((this.state.total - 1) % this.state.perPage == 0) page--;

    this.getCategories(page);
  }

  render() {
    return (
      <div className="container-fluid">
        {/* <!-- DataTales Example --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Categories</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loading ? (
                    <tr>
                      <td colSpan="7">
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                          <Spinner animation="border" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    this.state.categories.map((category) => (
                      <tr key={category.id}>
                        
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                       
                        <td style={{ textAlign: "center" }}>
                          <DeleteCategoryDialog
                            id={category.id}
                            handleDelete={this.handleDelete}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link to={"/dashboard/categories/update/" + category.id} className="text-dark">
                            <i
                              class="bi bi-pen-fill fs-4"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ float: "right" }}>
              {this.state.categories.length > 0 &&
                this.state.total > this.state.perPage && (
                  <div className="pagination-container">
                    <Pagination
                      activePage={this.state.currentPage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total}
                      pageRangeDisplayed={5}
                      onChange={(pageNumber) => this.getCategories(pageNumber)}
                      itemClass="page-item"
                      linkClass="page-link"
                      firstPageText="First"
                      lastPageText="Last"
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardCategories;
