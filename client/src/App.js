// App.js
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import './App.css';
import axios from 'axios';
import Home from './component/Home/Home';
import Login from './component/Authentication/login';
import Signup from './component/Authentication/Signup';
import signupFeide from './component/Authentication/signupFeide';
import Gallery from "./component/Gallery/Gallery";
import GalleryAuth from './component/GalleryAuth/GalleryAuth';
import AdminLogin from './component/Admin/AdminLogin';
import Admin from './component/Admin/Admin';
import ProductDisplay from './component/Payment/ProductDisplay';
import Message from './component/Payment/ProductDisplay';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

function App() {
  const StripeWrapper = () => {
    const [clientSecret, setClientSecret] = useState('');
  /*
    useEffect(() => {
      // Fetch the client secret from the backend
      const fetchClientSecret = async () => {
        const response = await axios.post('https://localhost:5210/payment/create-payment-intent');
        console.log(response.data.ClientSecret)
        setClientSecret(response.data.ClientSecret);
      };
  
      fetchClientSecret();
    }, []);

    const stripePromise = loadStripe('pk_test_51OJ0nXHPYHEs6KwM9FeiR8rbheYAom1e3QPRMr0AJyPQaajSVBK2EaijgJObJqFXYb8ey3qbstKgTN3SECR5xaHk00bhB5qYq0');
      */
    const message = true
    const options = { clientSecret: clientSecret };
    return message ? (
      <Message message={message} />
    ) : (
      <ProductDisplay />
    );
    
  };
  
  return (
    <Router>
      <div className="App">
        <Routes> {/* Wrap your Route elements with Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/Signup" element={<Signup />} />
          <Route path="/signupFeide" element={<signupFeide />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Gallery/Authenticated" element={<GalleryAuth />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/payment" element={<StripeWrapper />} />



          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
