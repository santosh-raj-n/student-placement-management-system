import React from 'react'
import "../styles/Navbar.css";
import { Link } from 'react-router-dom';

const Navbar=()=>{
    return(
        <nav>
            <h2>Placement Portal</h2>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>Companies</li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar