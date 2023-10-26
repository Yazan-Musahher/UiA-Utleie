import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Gallery.css';
import uialogo from '../assests/uialogo.png';

function Gallery() {
    const [tools, setTools] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();  // Instantiate useNavigate

    useEffect(() => {
        let url = 'http://localhost:5210/api/tools';
        if (selectedCategory) {
            url += `?categoryId=${selectedCategory}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => setTools(data))
            .catch(error => console.error('Error:', error));
    }, [selectedCategory]);

    const handleToolClick = () => {
        navigate('/login');  // Navigate to login page
    };

    return (
        <div className="gallery-page">
            <div className="navbar">
                <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
                
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

            <div className="main-content">
            <div className="container mt-5">
                <div className="row">
                    {tools.map(tool => (
                        <div className="col-md-4 mb-4" key={tool.toolId} onClick={handleToolClick} style={{ cursor: 'pointer' }}>
                            <div className="card">
                                <img src={tool.image} alt={tool.name} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{tool.name}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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

export default Gallery;
