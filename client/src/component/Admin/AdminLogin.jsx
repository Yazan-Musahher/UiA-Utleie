import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './AdminLogin.css';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State for displaying messages
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        fetch('https://localhost:5210/api/AdminLogin/loginAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: username, Password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Store the token
                setMessage(data.message); // Display success message
                navigate('/admin'); // Redirect to admin dashboard
            } else {
                setMessage(data.message); // Display error message
            }
        })
        .catch(error => {
            setMessage('Login failed. Please try again.'); // Handle network errors
        });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Admin Login</h2>
                {message && <p className="message">{message}</p>} {/* Display messages */}
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
        </div>
    );
}

export default AdminLogin;
