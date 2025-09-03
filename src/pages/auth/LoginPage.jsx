import { useContext, useEffect, useState } from 'react'
import { Login } from '../../components';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';


const LoginPage = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'; // default to home if no previous route
    const { user } = useContext(AuthContext);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const message = params.get('message');
        if (message) {
            toast.error(message)
        }
    }, [location]);

    if (user) {
        return <Navigate to="/"/>
    }

    return (
        <div className="pt-16 flex justify-center">
            <Login navigateTo={from} />
        </div>

    )
}

export default LoginPage;