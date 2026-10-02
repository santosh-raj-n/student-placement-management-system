import React, { useEffect, useState } from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import useAuth from "../hooks/useAuth";
import { getStats } from "../api/statsApi";

import "../styles/Home.css";

const Home = () => {
  const { isLoggedIn, user } = useAuth();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        setError(error.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          {isLoggedIn ? (
            <>
              <WelcomeBanner name={user?.name} />

              <p className="home-subtitle">
                Track placement opportunities, companies, and your career
                progress from one place.
              </p>
            </>
          ) : (
            <>
              <h1>Welcome to Placement Portal</h1>

              <p className="home-subtitle">
                Discover companies, explore opportunities, and manage your
                placement journey.
              </p>

              <div className="home-login-message">
                Please login or create an account to get started.
              </div>
            </>
          )}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-heading">
          <h2>Placement Statistics</h2>

          <p>
            Get a quick overview of the latest placement opportunities.
          </p>
        </div>

        {loading && (
          <div className="home-status-message">
            Loading statistics...
          </div>
        )}

        {error && (
          <div className="home-status-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                title={stat.title}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;