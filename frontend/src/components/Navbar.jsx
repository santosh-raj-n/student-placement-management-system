import React from 'react';
import useAuth from '../hooks/useAuth';
import "../styles/Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {

    const { isLoggedIn, user, logout } = useAuth();

    return (
        <nav>
            <h2>Placement Portal</h2>

            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/company">Companies</Link>
                </li>

                {isLoggedIn ? (
                    <>
                        <li>
                            <span>Welcome, {user?.name}</span>
                        </li>

                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>

                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;