import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applyToCompany } from "../api/applicationApi";
import {
  getCompanies,
  deleteCompany as deleteCompanyApi,
} from "../api/companyApi";
import "../styles/Companies.css";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicationErrors, setApplicationErrors] = useState({});

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const deleteCompany = async (idToDelete) => {
    try {
      await deleteCompanyApi(idToDelete);

      const remainingCompanies = companies.filter(
        (company) => company.id !== idToDelete,
      );

      setCompanies(remainingCompanies);
      setError("");
    } catch (error) {
      setError("Failed to delete company");
    }
  };

  const editCompany = (idToEdit) => {
    const companyToEdit = companies.find(
      (company) => String(company.id) === String(idToEdit),
    );

    if (
      user?.role === "RECRUITER" &&
      String(user?.id) === String(companyToEdit?.recruiterId)
    ) {
      navigate(`/company/edit/${idToEdit}`);
    }
  };

  const applyForCompany = async (companyId) => {
    try {
      const application = await applyToCompany(companyId);

      setApplicationErrors((prev) => ({
        ...prev,
        [companyId]: "",
      }));

      alert(`Application submitted! Status: ${application.status}`);
    } catch (error) {
      setApplicationErrors((prev) => ({
        ...prev,
        [companyId]: error.message || "Failed to submit application",
      }));
    }
  };

  const totalOpenings = companies.reduce((total, company) => {
    return total + Number(company.openings);
  }, 0);

  return (
    <main className="companies-page">
      <div className="companies-header">
        {user?.role === "RECRUITER" && (
          <Link to="/company/register" className="register-company-link">
            + Register New Company
          </Link>
        )}

        <h1>Companies That Are Hiring</h1>

        <p>
          Explore available placement opportunities and find your next career
          opportunity.
        </p>
      </div>

      {loading && (
        <div className="loading-message">
          <h2>Loading companies...</h2>
        </div>
      )}

      {error && typeof error === "string" && (
        <div className="status-message error-message">{error}</div>
      )}

      {error && typeof error === "object" && (
        <div className="status-message error-message">
          {Object.values(error).map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <div className="companies-stats">
        <div className="companies-stat-card">
          <span>Total Companies</span>
          <strong>{companies.length}</strong>
        </div>

        <div className="companies-stat-card">
          <span>Total Openings</span>
          <strong>{totalOpenings}</strong>
        </div>
      </div>

      <div className="companies-content">
        {[...companies]
          .sort((a, b) => {
            const aIsOwned = String(a.recruiterId) === String(user?.id);
            const bIsOwned = String(b.recruiterId) === String(user?.id);

            return Number(bIsOwned) - Number(aIsOwned);
          })
          .map((company) => (
            <div key={company.id} className="company-card">
              <h2>{company.name}</h2>

              <p className="company-detail">
                <strong>Hiring Location:</strong> {company.location}
              </p>

              <p className="company-detail">
                <strong>Package:</strong> {company.packageAmount}
              </p>

              <p className="company-detail">
                <strong>Openings:</strong> {company.openings}
              </p>
              <p className="company-detail">
                <strong>Eligible Departments:</strong>{" "}
                {company.anyDepartmentEligible
                  ? "Any Department"
                  : company.eligibleDepartments?.join(", ") || "None specified"}
              </p>

              <div className="company-actions">
                {/* Recruiter can only edit/delete their own company */}
                {user?.role === "RECRUITER" &&
                  user?.id === company.recruiterId && (
                    <>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => editCompany(company.id)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteCompany(company.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}

                {/* Students can apply to companies */}
                {user?.role === "STUDENT" && (
                  <button
                    type="button"
                    className="apply-button"
                    onClick={() => applyForCompany(company.id)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
              {applicationErrors[company.id] && (
                <div className="status-message error-message" role="alert">
                  ⚠️ {applicationErrors[company.id]}
                </div>
              )}
            </div>
          ))}
      </div>
    </main>
  );
};

export default Companies;
