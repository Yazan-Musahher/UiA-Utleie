import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (Component) => {
  return (props) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated || isAuthenticated === 'false') {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
};

export default ProtectedRoute;