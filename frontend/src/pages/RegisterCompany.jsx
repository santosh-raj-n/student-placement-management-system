
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCompany } from "../api/companyApi";
import "../styles/Companies.css";

const RegisterCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    package: "",
    openings: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "RECRUITER") {
    return (
      <main className="companies-page">
        <h2>Recruiter access required</h2>
        <p>Only recruiters can register companies.</p>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const companyData = {
        name: newCompany.name,
        location: newCompany.location,
        openings: Number(newCompany.openings),
        packageAmount: Number(newCompany.package),
      };

      await createCompany(companyData);

      navigate("/company");
    } catch (err) {
      try {
        setError(JSON.parse(err.message));
      } catch {
        setError(err.message || "Failed to register company.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="companies-page">
      <section className="company-form-section">
        <h1>Register a New Company</h1>
        <p>Add a new placement opportunity for students.</p>

        {error && (
          <div className="status-message error-message">
            {typeof error === "string"
              ? error
              : Object.values(error).map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
          </div>
        )}

        <form className="company-form" onSubmit={handleSubmit}>
          <div className="company-form-group">
            <label>Company Name</label>
            <input
              type="text"
              required
              placeholder="Enter company name"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
              }
            />
          </div>

          <div className="company-form-group">
            <label>Hiring Location</label>
            <input
              type="text"
              required
              placeholder="Enter hiring location"
              value={newCompany.location}
              onChange={(e) =>
                setNewCompany({ ...newCompany, location: e.target.value })
              }
            />
          </div>

          <div className="company-form-group">
            <label>Package Per Annum (LPA)</label>
            <input
              type="number"
              min="0"
              required
              placeholder="Enter package amount"
              value={newCompany.package}
              onChange={(e) =>
                setNewCompany({ ...newCompany, package: e.target.value })
              }
            />
          </div>

          <div className="company-form-group">
            <label>Number of Openings</label>
            <input
              type="number"
              min="1"
              required
              placeholder="Enter number of openings"
              value={newCompany.openings}
              onChange={(e) =>
                setNewCompany({ ...newCompany, openings: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Company"}
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => navigate("/company")}
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
};

export default RegisterCompany;
