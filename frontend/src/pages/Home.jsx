import React, { useEffect, useState } from 'react';
import WelcomeBanner from '../components/WelcomeBanner';
import StatCard from '../components/StatCard';
import useAuth from '../hooks/useAuth';
import { getStats } from '../api/statsApi';

const Home = () => {

    const { isLoggedIn } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await getStats();
                setStats(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
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

                {loading && <p>Loading statistics...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && stats.map((stat, index) => {
                    return (
                        <StatCard
                            key={index}
                            number={stat.number}
                            title={stat.title}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Home;