import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import uialogo from '../assests/uialogo.png';

function Admin() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    email: '',
    studentNumber: '',
    lastName: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/Adminlogin');
    } else {
      fetchUsers(); // Fetch users when component mounts and authToken exists
    }
  }, [navigate]); // useEffect dependency array

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/Adminlogin');
  };

  // Get request to fetch all users from that API 
  const fetchUsers = () => {
    const authToken = localStorage.getItem('authToken');
    fetch('https://localhost:5210/api/Admin/Users', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => setUsers(data))
    .catch(error => console.error('Error fetching users:', error));
  };

  const openModal = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // update users information through PUT api
  const handleUpdate = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:5210/api/Admin/Users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentUser)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(json => {
          console.error('Error response body:', json);
          throw new Error(`Error: ${response.status}`);
        });
      }
      console.log('User updated successfully');
      setShowModal(false);
      fetchUsers();
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response body:', error.response);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    });
  };


// Delete user through delete api 
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const authToken = localStorage.getItem('authToken');
      fetch(`https://localhost:5210/api/Admin/Users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
    }
  };

  return (
    <div className="gallery-page">
      <div className="navbar">
        <Link to="/">
          <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
        </Link>
        <button onClick={logout} className="btn btn-danger logout-button">
          Logout
        </button>
      </div>
      <div className="sidebar">
        <div className="filter-section">
          <h4>Filtrer utstyr</h4>
          <button onClick={fetchUsers} className="btn btn-secondary mb-2">
            All Users
          </button>
          <button className="btn btn-secondary mb-2">Products</button>
          <button className="btn btn-secondary mb-2">Payments</button>
        </div>
      </div>
      <div className="user-list container mt-4">
        <h3>Users</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Student Number</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.studentNumber}</td>
                <td>
                  <button className="btn btn-primary mr-2" onClick={() => openModal(user)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* This form will appear only when admin click on update button on sp */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Student Number</Form.Label>
              <Form.Control
                type="text"
                name="studentNumber"
                value={currentUser.studentNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={currentUser.lastName || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="admin-footer">
        <p>© 2023 Your Company Name. All rights reserved.</p>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
