import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert, Card, CardBody, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Import Link

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

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
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage('Invalid Email or Password');
                return;
            }

            console.log('Login successful:', data);
            setMessage('Login successful');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            setMessage('An error occurred while trying to log in');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh', color: 'white' }}>
            <Card style={{ width: '400px', marginTop: '-50px' }}>
                <CardHeader className="bg-danger text-white">Login</CardHeader>
                <CardBody>
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
                        <Button type="submit" color="danger" block>Login</Button>
                    </Form>
                    <Button color="link" className="mt-3" style={{ color: 'black' }}>Forgot Password?</Button>
                   <Link to = '/Signup'><Button color="danger" className="mt-3" block>Register</Button></Link> 
                </CardBody>
            </Card>
        </Container>
    );
}

export default Login;
