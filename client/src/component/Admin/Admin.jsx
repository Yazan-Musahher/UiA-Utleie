import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import uialogo from '../assests/uialogo.png';

function Admin() {
  const [view, setView] = useState('users');
  const [users, setUsers] = useState([]);
  const [tools, setTools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    email: '',
    studentNumber: '',
    lastName: ''
  });
  const [currentTool, setCurrentTool] = useState({
    toolId: '',
    name: '',
    isAvailable: false,
    categoryId: ''
  });
  const navigate = useNavigate();

  const openToolModal = (tool) => {
    console.log('Opening modal with tool:', tool); 
    setCurrentTool(tool);
    setShowToolModal(true);
  };

  const closeToolModal = () => setShowToolModal(false);

  const handleToolInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setCurrentTool({ ...currentTool, [name]: checked });
    } else {
      setCurrentTool({ ...currentTool, [name]: value });
    }
  };

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

  // Tools Section 

  // Fetch tools thourgh API

  const fetchTools = () => {
    const authToken = localStorage.getItem('authToken');
    fetch('https://localhost:5210/api/Tools', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => setTools(data)) // Assuming you have a state for tools
    .catch(error => console.error('Error fetching tools:', error));
  };

  // Delete a Tool
  const handleDeleteTool = (toolId) => {
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:5210/api/Tools/${toolId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(response => {
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      fetchTools(); // Refresh the list of tools
    })
    .catch(error => console.error('Error deleting tool:', error));
  };

  // Create a new Tool

  const handleCreateTool = (newTool) => {
    const authToken = localStorage.getItem('authToken');
    fetch('https://localhost:5210/api/Tools', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTool)
    })
    .then(response => {
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      fetchTools();
    })
    .catch(error => console.error('Error creating tool:', error));
  };

  // Update an exist Tool

  const handleUpdateTool = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:5210/api/Tools/${currentTool.toolId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentTool)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log('Tool updated successfully');
      closeToolModal();
      fetchTools();
    })
    .catch(error => {
      console.error('Error updating tool:', error);
    });
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
          <button onClick={fetchTools} className="btn btn-secondary mb-2">Products</button>
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
      <Modal show={showToolModal} onHide={closeToolModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateTool}>
        <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={currentTool.name}
          onChange={handleToolInputChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Check 
          type="checkbox" 
          label="Available" 
          name="isAvailable"
          checked={currentTool.isAvailable}
          onChange={handleToolInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Category ID</Form.Label>
        <Form.Control
          type="number"
          name="categoryId"
          value={currentTool.categoryId}
          onChange={handleToolInputChange}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Update
      </Button>
        </Form>
      </Modal.Body>
    </Modal>

    <div className="tools-list container mt-4">
      {tools.length > 0 && (
        <>
          <h3>Tools</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Available</th>
                <th scope="col">Category</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => (
                <tr key={tool.toolId}>
                  <td>{tool.name}</td>
                  <td>{tool.isAvailable ? "Yes" : "No"}</td>
                  <td>{tool.categoryId}</td>
                  <td>
                    <button className="btn btn-primary mr-2" onClick={() => openToolModal(tool)}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteTool(tool.toolId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
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
