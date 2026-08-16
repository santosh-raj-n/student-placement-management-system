import React from 'react';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    return (
        <>
            <h1>Login Page</h1>

            <button onClick={login}>  Login </button>
        </>
    )
}

export default Login