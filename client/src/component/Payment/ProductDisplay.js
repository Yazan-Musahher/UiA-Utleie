import React, { useEffect, useState } from 'react';

const ProductDisplay = () => (
  <section style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  }}>
    <div className="product" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <img
        src="https://www.uia.no/var/uia/storage/images/media/images/opplastede-bilder/uiahjelp.jpg/2661816-1-nor-NO/uiahjelp.jpg_large.jpg"
        alt="UIA Help Desk"
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          objectFit: 'contain',
          marginBottom: '20px'
        }}
      />
      <div className="description" style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h3>Prisen for utleie av valgte produkt</h3>
        <h5>200 NOK</h5>
      </div>
    </div>
    <form action="https://localhost:5210/create-checkout-session" method="POST">
      <button type="submit" style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px 32px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transitionDuration: '0.4s'
      }}>
        Checkout
      </button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const query = new URLSearchParams(window.location.search);
  
      if (query.get("success")) {
        const sessionId = query.get("session_id");
        if (sessionId) {
          // Call your backend to confirm the rental with the session ID
          confirmRental(sessionId);
        } else {
          setMessage("Order placed! You will receive an email confirmation.");
        }
      }
  
      if (query.get("canceled")) {
        setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
      }
    }, []);
  
    const confirmRental = (sessionId) => {
      // Assuming you store toolId and rentalDate in localStorage or in a similar persistent state
      const toolId = localStorage.getItem('toolId');
      const rentalDate = localStorage.getItem('rentalDate');
      
      fetch(`https://localhost:5210/api/ToolRenting/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any needed headers here, such as Authorization if required
        },
        body: JSON.stringify({ ToolId: toolId, RentingDate: rentalDate, SessionId: sessionId })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to confirm the rental');
        }
        return response.json();
      })
      .then(data => {
        setMessage(data.message || "Tool rented successfully!");
      })
      .catch(error => {
        setMessage("There was an error confirming the rental: " + error.message);
      });
    };
  
    return message ? (
      <Message message={message} />
    ) : (
      <ProductDisplay />
    );
  }