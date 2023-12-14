import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Corrected component name to start with an uppercase letter
function SignupFeide() {
  const query = useQuery();
  const [email, setEmail] = useState(query.get('email') || '');
  const [name, setName] = useState(query.get('name') || '');
  const [studentNumber, setStudentNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform the post request to your signup endpoint
    const response = await fetch('https://localhost:5210/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: email,
        Name: name,
        StudentNumber: studentNumber,
        // ... other fields as needed
      }),
    });

    // Handle response...
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Student Number:
          <input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignupFeide;
