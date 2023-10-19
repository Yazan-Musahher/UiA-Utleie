import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; // Import Link
import uiahjelp from '../assests/uiahjelp.jpg'
import uialogo from '../assests/uialogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    return (
        <div className="home-container">
            <div className="top-navbar">
                <img src={uialogo} alt="Logo" className="navbar-logo" />

                <a href="#">For studenter |</a>
                <a href="#">For ansatte</a>
                <a href="#">Kontakt oss</a>
                <a href="#">Si ifra</a>
                <a href="#">Ledige stillinger</a>
            </div>

            <div className="secondary-navbar">
                <a href="#">Studier</a>
                <a href="#">Forskning</a>
                <a href="#">Samarbeid</a>
                <a href="#">Om UiA</a>
            </div>

            <div className="main-content">
                <img src={uiahjelp} alt="Main" className="main-image"/>

                <div className="clickable-boxes">
                    <div className="box">ClickiT</div>
                    <div className="box">Chat med UiA Hjelp</div>
                    <div className="box">Driftsmeldinger</div>
                    <div className="box">Innsia/Microsoft 365</div>
                    <div className="box">Få oversikt som ny student</div>
                    <div className="box">Pålogging</div>
                </div>
            </div>

            <div className="contact-info">
                Kontakt oss<br/>
                38 14 10 00<br/>
                Man – fre: 08:00 - 21:00 | Lør: 08:30 - 16:00<br/>
                <a href="mailto:hjelp@uia.no">hjelp@uia.no</a>
            </div>

            <div className="equipment-loan">
                <p> Har du behov for å låne utstyr?</p>
                <Link to = "/Gallery" className="equipment-link">Lei utstyr her</Link>
            </div>
            
            <footer className="footer">
                <div className="footer-column">
                    <h4>Snakk med oss</h4>
                    Chat med UiA Hjelp<br/>
                    Sentralbord: 38 14 10 00<br/>
                    Mandag - fredag: 0800 - 2100<br/>
                    Lørdag: 0830 - 1600
                </div>
                <div className="footer-column">
                    <h4>Skriv til oss</h4>
                    Universitetet i Agder<br/>
                    Postboks 422<br/>
                    4604 Kristiansand<br/>
                    <a href="mailto:contact@uia.no">Send e-post</a><br/>
                    Organisasjonsnummer: 970 546 200
                </div>
                <div className="footer-column">
                    <h4>Besøk oss</h4>
                    <a href="#">Campus Kristiansand i kart</a><br/>
                    <a href="#">Campus Grimstad i kart</a><br/>
                    <a href="#">Finn fram på campus</a><br/>
                    Alle åpningstider
                </div>
            </footer>

        </div>

        
    );
}

export default Home;
