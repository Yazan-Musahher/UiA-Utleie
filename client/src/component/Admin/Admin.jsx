import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import uialogo from '../assests/uialogo.png';

function Admin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a valid authentication token exists
        const authToken = localStorage.getItem('authToken');
        console.log("Retrieved token:", authToken); // This should be a string

        // Redirect to AdminLogin if not authenticated
        if (!authToken) {
            navigate('/Adminlogin');
        }
    }, [navigate]);

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken'); // Remove the token
        navigate('/Adminlogin'); // Redirect to the login page
    };

    // Function to fetch users
    const fetchUsers = () => {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:5210/api/Admin/Users', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setUsers(data);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    };

    return (
        <div className="gallery-page">
            <div className="navbar">
                <Link to="/">
                    <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
                </Link>
                <button onClick={logout} className="btn btn-danger logout-button">Logout</button>
            </div>
            <div className="sidebar">
                <div className="filter-section">
                    <h4>Filtrer utstyr</h4>
                    <button onClick={fetchUsers} className="btn btn-secondary mb-2">All Users</button>
                    <button className="btn btn-secondary mb-2" >Products</button>
                    <button className="btn btn-secondary mb-2">Payments</button>
                </div>
            </div>

            <div className="user-list">
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} - {user.email} - {user.studentNumber} </li>
                    ))}
                </ul>
            </div>

            <div className="gallery-footer">
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
