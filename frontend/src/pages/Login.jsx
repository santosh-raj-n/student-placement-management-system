import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const Login = () => {

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const user = await response.json();

            console.log("Logged in user:", user);

            login(user);

        } catch (error) {

            console.error("Login error:", error);

            alert("Invalid email or password");

        }
    };

    return (
        <>
            <h1>Login Page</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email:</label>

                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Password:</label>

                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>
        </>
    );
};

export default Login;