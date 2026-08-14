import React, {useState, useEffect} from 'react'
import WelcomeBanner from '../components/WelcomeBanner';
import StatCard from '../components/StatCard';

const Home=()=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
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

    const savedLogin = localStorage.getItem("isLoggedIn");

            if (savedLogin) {
                setIsLoggedIn(JSON.parse(savedLogin));
            }
    }, []);
    return(
    <>
        {isLoggedIn ? (
            <WelcomeBanner name="Santosh" />
                ) : (
                <h2>Please login to continue</h2>
            )}
        
        <button onClick={() => {
            setIsLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
            }}>
                 Login
        </button>
            <br />
            <br />
        <button onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem("isLoggedIn");
            }}>
                Logout
        </button>

        <div className="stats-section">
            <h2>Placement Statistics</h2>
            {
                stats.map((stat, index)=>{
                    return <StatCard
                    key={index}
                    number={stat.number}
                    title={stat.title}
                    />
                })
            }
        </div>
    </>
    );
}

export default Home;