import React from 'react'

const Login = (props) => {
    return (
        <>
            <h1>Login Page</h1>

            <button onClick={() => {
              props.setIsLoggedIn(true);
              localStorage.setItem("isLoggedIn", "true");
              }}>  Login
            </button>
        </>
    )
}

export default Login