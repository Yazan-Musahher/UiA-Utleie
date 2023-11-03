import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './GalleryAuth.css'; // Your CSS file for styling
import uialogo from '../assests/uialogo.png';
import ProtectedRoute from '../../ProtectedRoute'; // Your protected route component

function GalleryAuth() {
    const [tools, setTools] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [username, setUsername] = useState(''); // State to hold the username
    const [rentalDates, setRentalDates] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }

        let url = 'http://localhost:5210/api/tools';
        if (selectedCategory) {
            url += `?categoryId=${selectedCategory}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setTools(data);
                // Initialize rental dates for all tools with today's date
                const initialRentalDates = data.reduce((dates, tool) => {
                    dates[tool.toolId] = new Date(); // Set today's date for each tool
                    return dates;
                }, {});
                setRentalDates(initialRentalDates);
            })
            .catch(error => console.error('Error:', error));
    }, [selectedCategory]);

    // Logout logic
    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    // Function to handle tool rental
    const rentTool = (toolId) => {
        const rentalDate = rentalDates[toolId];
        if (!rentalDate) {
            alert('Please select a date before renting a tool.');
            return;
        }

        const formattedDate = rentalDate.toISOString();

        fetch('http://localhost:5210/api/toolrenting/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ toolId, rentingDate: formattedDate }),
            credentials: 'include' // Include cookies with the request
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to rent tool');
            }
            return response.json();
        })
        .then(data => {
            alert('Tool rented successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error renting the tool.');
        });
    };

    // Function to handle date change
    const handleDateChange = (date, toolId) => {
        setRentalDates({
            ...rentalDates,
            [toolId]: date
        });
    };

    return (
        <div className="gallery-page">
            <div className="navbar">
            <Link to="/">
              <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
            </Link>
                <div className="nav-right">
                    <span className="username">Welcome, {username}!</span>
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
            </div>
            <div className="sidebar">
                <div className="filter-section">
                    <h4>Filtrer utstyr</h4>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(null)}>All Categories</button>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(1)}>Monitor</button>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(2)}>Charger</button>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(3)}>Camera</button>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(4)}>Headphones</button>
                    <button className="btn btn-secondary mb-2" onClick={() => setSelectedCategory(5)}>Ipad</button>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    {tools.map(tool => (
                        <div className="col-md-4 mb-4" key={tool.toolId}>
                            <div className="card">
                                <img src={tool.image} alt={tool.name} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{tool.name}</h5>
                                    <DatePicker
                                        selected={rentalDates[tool.toolId]}
                                        onChange={(date) => handleDateChange(date, tool.toolId)}
                                        minDate={new Date()}
                                        dateFormat="MMMM d, yyyy"
                                        className="form-control"
                                    />
                                    <button 
                                        className="btn btn-primary mt-2"
                                        onClick={() => rentTool(tool.toolId)}
                                    >
                                        Rent
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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

export default ProtectedRoute(GalleryAuth);
