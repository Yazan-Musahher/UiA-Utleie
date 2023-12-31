import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert, Card, CardBody, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import uialogo from '../assests/uialogo.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const name = urlParams.get('name'); 
        console.log("URL search params:", window.location.search); // Log the full search params
        console.log("Extracted token:", token); // Log the extracted token
      
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', name);
          navigate('/Gallery/Authenticated'); // Redirect to the protected page
        }
      }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('https://localhost:5210/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: username, Password: password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                // If login is successful, store the JWT in local storage
                localStorage.setItem('authToken', data.token); // Storing the token
                localStorage.setItem('username', data.name); // Storing the user's name
                localStorage.setItem('isAuthenticated', 'true');

                setMessage('Login successful');
                navigate('/Gallery/Authenticated'); // Redirect to a protected route after login
            } else {
                setMessage(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            setMessage('An error occurred while trying to log in');
        }


    };
    const handleFeideLogin = () => {
        // Redirect to the Feide login endpoint on your API
        window.location.href = 'https://localhost:5210/api/account/login/feide';
        
    };


    return (
        <>
            <div className="navbar">
                <Link to="/">
                    <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
                </Link>
            </div>
        <div className={styles.fullHeight}>
            <Card className={styles.loginCard} style={{ maxWidth: '500px' }}>
                <CardHeader className={styles.loginCardHeader}>Login</CardHeader>

                <CardBody className={styles.loginCardBody}>
                    {message && <Alert color={message === 'Login successful' ? 'success' : 'danger'}>{message}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <FormGroup>
                            <Label for="username">Email</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button type="submit" color="danger" block style={{ borderRadius: '25px' }}>Login</Button>
                        <Button onClick={handleFeideLogin} color="primary" block style={{ borderRadius: '25px', marginTop: '10px' }}>
                            Login with Feide
                        </Button>
                    </Form>
                    <Button color="link" className="mt-3" style={{ color: 'black' }}>Forgot Password?</Button>
                    <Link to="/Signup"><Button color="danger" className="mt-3" block style={{ borderRadius: '25px' }}>Register</Button></Link>
                </CardBody>
                
            </Card>
        </div>
            <div className={styles.galleryFooter}>
                <p>© 2023 Your Company Name. All rights reserved.</p>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </>
    );
}    

export default Login;