import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Card, CardBody, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import uialogo from '../assests/uialogo.png';


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
            const response = await fetch('https://localhost:5210/api/account/signup', {
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
        <>
            <div className="navbar">
                <Link to="/">
                    <img src={uialogo} alt="Logo" className="gallery-navbar-logo" />
                </Link>
            </div>
        <div className={styles.fullHeight}>
            <Card className={styles.loginCard} style={{ maxWidth: '500px' }}>
                <CardHeader className={styles.loginCardHeader}>Signup</CardHeader>
                <CardBody className={styles.loginCardBody}>
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
                        <Button type="submit" color="danger" block style={{ borderRadius: '25px' }}>Signup</Button>
                    </Form>
                    <Link to="/Login"><Button color="white" className="mt-3" block style={{ borderRadius: '25px' }}>Already have an account?</Button></Link>
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

export default Signup;
