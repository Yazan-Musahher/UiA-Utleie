import React from 'react';
import './Gallery.css';
import uiahjelp from "../assests/uiahjelp.jpg";
import uialogo from '../assests/uialogo.png'


function Gallery() {
    return (
        <div className="gallery-page">
            <div className="navbar">
                <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />

                Navbar Content
            </div>
            <div className="sidebar">
                Sidebar Content
                <div className="filter-section">
                    <h3>Filtrer utstyr</h3>
                    <div className="checkbox-item">
                        <input type="checkbox" id="filter1" />
                        <label htmlFor="filter1">Pc skjerm</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="filter2" />
                        <label htmlFor="filter2">Pc</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="filter3" />
                        <label htmlFor="filter2">Lader</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="filter4" />
                        <label htmlFor="filter2">Kamera</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="filter5" />
                        <label htmlFor="filter2">Hodetelefoner</label>
                    </div>
                    {/* ... Add more checkboxes as needed ... */}
                </div>
            </div>
            <div className="image-container">
                {/* Add your images here */}
               <div className="image-group">
                   <h2>Pc skjerm</h2>
                <img src={uiahjelp} alt="Main" className="main-image"/>
                <img src={uiahjelp} alt="Main" className="main-image"/>
               </div>
                <div className="image-group">
                    <h2>Pc</h2>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                </div>
                <div className="image-group">
                    <h2>Lader</h2>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                </div>
                <div className="image-group">
                    <h2>Kamera</h2>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                </div>
                <div className="image-group">
                    <h2>Hodetelefoner</h2>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                    <img src={uiahjelp} alt="Main" className="main-image"/>
                </div>
                
                {/* Add more images as needed */}
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
