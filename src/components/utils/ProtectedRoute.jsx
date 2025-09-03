import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';



const ProtectedDocRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  return (isAuthenticated && isAdmin) ? children : <Navigate to="/admin/login" state={{from : location}} replace/>;
};


export default ProtectedDocRoute;