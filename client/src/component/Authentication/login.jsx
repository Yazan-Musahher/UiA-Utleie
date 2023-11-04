import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert, Card, CardBody, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5210/api/account/login', {
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

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh', maxWidth: '100%', color: 'white' }}>
            <Card style={{ width: '25rem', maxWidth: 'none', padding: '25px', borderRadius: '50px', marginTop: '150px' }}>
                <CardHeader className="bg-danger text-white" style={{ borderRadius: '25px' }}>Login</CardHeader>
                <CardBody style={{ padding: '25px' }}>
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
                    </Form>
                    <Button color="link" className="mt-3" style={{ color: 'black' }}>Forgot Password?</Button>
                    <Link to="/Signup"><Button color="danger" className="mt-3" block style={{ borderRadius: '25px' }}>Register</Button></Link>
                </CardBody>
            </Card>
        </Container>
    );
}    

export default Login;
