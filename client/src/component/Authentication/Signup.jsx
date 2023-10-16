import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert, Card, CardBody, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate

function Signup() {
    const [formData, setFormData] = useState({
        Email: '',
        Name: '',
        LastName: '',
        PhoneNumber: '',
        StudentNumber: '',
        Password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Instantiate useNavigate

    useEffect(() => {
        if (message === 'Signup successful') {
            const timer = setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 2000); // Wait for 2 seconds before redirecting

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [message, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5210/api/account/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                setMessage(data.message || 'Signup failed');
                return;
            }

            setMessage('Signup successful');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            setMessage('An error occurred while trying to sign up');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh',color: 'white' }}>
            <Card style={{ width: '400px', marginTop: '-50px' }}>
                <CardHeader className="bg-danger text-white">Signup</CardHeader>
                <CardBody>
                    {message && <Alert color={message === 'Signup successful' ? 'success' : 'danger'}>{message}</Alert>}
                    <Form onSubmit={handleSignup}>
                        <FormGroup>
                            <Label for="Email">Email</Label>
                            <Input
                                type="email"
                                name="Email"
                                id="Email"
                                placeholder="Enter your email"
                                value={formData.Email}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Name">Name</Label>
                            <Input
                                type="text"
                                name="Name"
                                id="Name"
                                placeholder="Enter your name"
                                value={formData.Name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="LastName">Last Name</Label>
                            <Input
                                type="text"
                                name="LastName"
                                id="LastName"
                                placeholder="Enter your last name"
                                value={formData.LastName}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="PhoneNumber">Phone Number</Label>
                            <Input
                                type="text"
                                name="PhoneNumber"
                                id="PhoneNumber"
                                placeholder="Enter your phone number"
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="StudentNumber">Student Number</Label>
                            <Input
                                type="text"
                                name="StudentNumber"
                                id="StudentNumber"
                                placeholder="Enter your student number"
                                value={formData.StudentNumber}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Password">Password</Label>
                            <Input
                                type="password"
                                name="Password"
                                id="Password"
                                placeholder="Enter your password"
                                value={formData.Password}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <Button type="submit" color="danger" block>Signup</Button>
                        <Link to = '/Login'><Button color="white" className="mt-4" block>Already have account? </Button></Link> 
                    </Form>
                </CardBody>
            </Card>
            
        </Container>
    );
}

export default Signup;
