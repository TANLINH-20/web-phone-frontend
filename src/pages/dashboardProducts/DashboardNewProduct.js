import axios from 'axios'
import React, { Component } from 'react'
import toast from 'react-hot-toast'

class DashboardNewProduct extends Component {
    constructor() {
        super()

        this.state = {
            name: '',
            category_id: '',
            brand: '',
            description: '',
            details: '',
            photos: null,
            price: '',
            size: '',
            color: '',
            quantity: 1,
            success: false,
            error: '',
            errorKeys: '',
            categories: []
        }

        this.baseState = this.state 

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.fileSelectHandler = this.fileSelectHandler.bind(this)
    }

    componentDidMount() {
        this.getCategories()
    }

    getCategories() {
		axios.get('http://127.0.0.1:8000/api/product/categories').then((
            response 
        ) => {
            this.setState({
                category_id: response.data[0].id,
				categories: [...response.data]
            })
        })
	}

    handleSubmit(e) {
		e.preventDefault()
        const fd = new FormData()
        Array.from(this.state.photos).forEach(photo => fd.append('photos[]', photo))
        fd.append('name', this.state.name)
        fd.append('category_id', this.state.category_id)
        fd.append('brand', this.state.brand) 
        fd.append('description', this.state.description)
        fd.append('details', this.state.details)
        fd.append('price', this.state.price)
        fd.append('size', this.state.size)
        fd.append('color', this.state.color)
        fd.append('quantity', this.state.quantity)

        axios.post('http://127.0.0.1:8000/api/products', fd , {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
        }).then(response => {
            this.setState({
                ...this.baseState,
                success: true
            })
            toast.success('Product created successfully');
            this.getCategories()
        }).catch(err => {
            this.setState({
                error: err.response.data.errors,
            })
        })
    }

    handleChange(event) {

        if (event.target.type == 'select-one') {
            this.setState({
                category_id: event.target.value
            })
        } else {
            const {name, value} = event.target
            this.setState({
                [name]: value
            })
        }

        if(this.state.success) {
            this.setState({
                success: false
            })
        }
    }
    
    fileSelectHandler(event) {
      console.log(event.target.files)
        this.setState({
            photos: event.target.files
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Add a New Product</h6>
                    </div>
                    <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="d-flex">
                            <div className="col-xl-6">
                                <div className="form-group me-3">
                                    <label className="small mb-1">Name</label>
                                    <input className="form-control" name="name" value={this.state.name} onChange={this.handleChange} type="text" placeholder="Product name"  required />
                                </div>
                                <div className="form-group me-3">
                                    <label className="small mb-1">Category</label>
                                    <select className="form-control" onChange={this.handleChange}>
                                        {this.state.categories && this.state.categories.map(c =>
                                            <option value={c.id} key={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group me-3">
                                    <label className="small mb-1">Brand</label>
                                    <input className="form-control" name="brand" value={this.state.brand} onChange={this.handleChange} type="text" placeholder="Product brand" required />
                                </div>
                                <div className="form-group me-3">
                                    <label className="small mb-1">Price</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">$</div>
                                        </div>
                                        <input className="form-control" name="price" value={this.state.price} onChange={this.handleChange} type="text" placeholder="Product price" required />
                                    </div>
                                </div>
                                <div className="form-group me-3">
                                    <label className="small mb-1">Upload Photo(s)</label>
                                    <input className="form-control" onChange={this.fileSelectHandler} type="file" multiple style={{paddingTop: '3px'}} required />
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group me-3">
                                    <label className="small mb-1">Description</label>
                                    <textarea rows='2' className="form-control" name="description" value={this.state.description} onChange={this.handleChange} placeholder="Product description" required />
                                </div>
                                <div className="form-group me-3">
                                    <label className="small mb-1">Details</label>
                                    <textarea rows='4' className="form-control" name="details" value={this.state.details} onChange={this.handleChange} placeholder="Product details" required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group me-3 col-md-5">
                                        <label className="small mb-1">Size</label>
                                        <input className="form-control" type="text" name="size" placeholder="Product size" onChange={this.handleChange} value={this.state.size} required />
                                    </div>
                                    <div className="form-group me-3 col-md-5">
                                        <label className="small mb-1">Color</label>
                                        <input className="form-control" type="text" name="color" placeholder="Product color" onChange={this.handleChange} value={this.state.color} required />
                                    </div>
                                    <div className="form-group me-3 col-md-2">
                                        <label className="small mb-1">Quantity</label>
                                        <input className="form-control" type="number" name="quantity" onChange={this.handleChange} value={this.state.quantity} required />
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary float-right">Create Product</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardNewProduct