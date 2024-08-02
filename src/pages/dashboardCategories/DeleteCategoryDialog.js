import React, {useState, Fragment} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import toast from 'react-hot-toast';

function DeleteCategoryDialog(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = () => {

        axios.delete(`http://127.0.0.1:8000/api/product/categories/${props.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        }).then(response => {
            props.handleDelete()
            handleClose()
            toast.success("Deleted Successfully")
        })	
    }
  
    return (
      <Fragment>
        <div onClick={handleShow}>
            <i id={props.id} style={{cursor: 'pointer'}} className="bi bi-trash3-fill fs-4"></i>
        </div>
  
        <Modal show={show} onHide={handleClose} style={{maxHeight:"400px"}}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
          <Modal.Footer >
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <strong>DELETE</strong>
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
}
  
export default DeleteCategoryDialog