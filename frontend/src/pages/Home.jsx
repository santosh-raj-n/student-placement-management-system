import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import WelcomeBanner from '../components/WelcomeBanner';
import StatCard from '../components/StatCard';
import useAuth from '../hooks/useAuth';

const Home = () => {

    const { isLoggedIn } = useAuth();
    const [stats, setStats] = useState([
        {
            number: "250+",
            title: "Students Placed",
        },
        {
            number: "50+",
            title: "Companies",
        },
        {
            number: "95%",
            title: "Placement Rate",
        },
    ]);

    useEffect(() => {
        setStats([
            {
                number: "500+",
                title: "Students Placed",
            },
            {
                number: "80+",
                title: "Companies",
            },
            {
                number: "92%",
                title: "Placement Rate",
            },
        ]);
    }, []);

    return (
        <>
            {isLoggedIn ? (
                <WelcomeBanner name="Santosh" />
            ) : (
                <h2>Please login to continue</h2>
            )}

            <div className="stats-section">
                <h2>Placement Statistics</h2>

                {stats.map((stat, index) => {
                    return (
                        <StatCard
                            key={index}
                            number={stat.number}
                            title={stat.title}
                        />
                    )
                })}
            </div>
        </>
    );
}

export default Home;