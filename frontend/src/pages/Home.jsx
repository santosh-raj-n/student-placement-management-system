import React, {useState, useEffect} from 'react'
import WelcomeBanner from '../components/WelcomeBanner';
import StatCard from '../components/StatCard';

const Home=()=>{
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
    return(
    <>
        <WelcomeBanner name="Santosh"/>
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