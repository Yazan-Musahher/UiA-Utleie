// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import './App.css';
import Home from './component/Home/Home';
import Login from './component/Authentication/login';
import Signup from './component/Authentication/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Wrap your Route elements with Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/Signup" element={<Signup />} /> 

        </Routes>
      </div>
    </Router>
  );
}

export default App;
