import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { applyToCompany } from "../api/applicationApi";
import {
  getCompanies,
  createCompany,
  updateCompany as updateCompanyApi,
  deleteCompany as deleteCompanyApi,
} from "../api/companyApi";
import "../styles/Companies.css";

const Companies = () => {
  const { user } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    package: "",
    openings: "",
  });

  const [editingCompany, setEditingCompany] = useState(null);

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

  const registerComp = async (e) => {
    e.preventDefault();

    try {
      const companyData = {
        name: newCompany.name,
        location: newCompany.location,
        openings: Number(newCompany.openings),
        packageAmount: Number(newCompany.package),
      };

      const createdCompany = await createCompany(companyData);

      setCompanies([...companies, createdCompany]);

      setNewCompany({
        name: "",
        location: "",
        package: "",
        openings: "",
      });

      setError("");
    } catch (error) {
      try {
        const validationErrors = JSON.parse(error.message);
        setError(validationErrors);
      } catch {
        setError(error.message);
      }
    }
  };

  const deleteCompany = async (idToDelete) => {
    try {
      await deleteCompanyApi(idToDelete);

      const remainingCompanies = companies.filter(
        (company) => company.id !== idToDelete
      );

      setCompanies(remainingCompanies);
      setError("");
    } catch (error) {
      setError("Failed to delete company");
    }
  };

  const editCompany = (idToEdit) => {
    const companyToEdit = companies.find(
      (company) => company.id === idToEdit
    );

    // Only allow editing if the logged-in recruiter owns the company
    if (
      user?.role === "RECRUITER" &&
      user?.id === companyToEdit?.recruiterId
    ) {
      setEditingCompany(companyToEdit);
    }
  };

  const updateCompany = async (e) => {
    e.preventDefault();

    try {
      const companyData = {
        name: editingCompany.name,
        location: editingCompany.location,
        openings: Number(editingCompany.openings),
        packageAmount: Number(editingCompany.packageAmount),
      };

      const updatedCompany = await updateCompanyApi(
        editingCompany.id,
        companyData
      );

      const updatedCompanies = companies.map((company) => {
        if (company.id === updatedCompany.id) {
          return updatedCompany;
        }

        return company;
      });

      setCompanies(updatedCompanies);
      setEditingCompany(null);
      setError("");
    } catch (error) {
      try {
        const validationErrors = JSON.parse(error.message);
        setError(validationErrors);
      } catch {
        setError(error.message);
      }
    }
  };

  const applyForCompany = async (companyId) => {
    try {
      const application = await applyToCompany(companyId);

      alert(`Application submitted! Status: ${application.status}`);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const totalOpenings = companies.reduce((total, company) => {
    return total + Number(company.openings);
  }, 0);

  return (
    <main className="companies-page">
      <div className="companies-header">
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
        {companies.map((company) => (
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
          </div>
        ))}
      </div>

      {/* Every recruiter can register a new company */}
      {user?.role === "RECRUITER" && (
        <section className="company-form-section">
          <h2>Register a New Company</h2>

          <form className="company-form" onSubmit={registerComp}>
            <div className="company-form-group">
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Enter the company name"
                value={newCompany.name}
                onChange={(e) => {
                  setNewCompany({
                    ...newCompany,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Hiring Location</label>

              <input
                type="text"
                placeholder="Enter the hiring location"
                value={newCompany.location}
                onChange={(e) => {
                  setNewCompany({
                    ...newCompany,
                    location: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Package Per Annum</label>

              <input
                type="number"
                placeholder="Enter the package amount"
                value={newCompany.package}
                onChange={(e) => {
                  setNewCompany({
                    ...newCompany,
                    package: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Number of Openings</label>

              <input
                type="number"
                placeholder="Enter number of openings"
                value={newCompany.openings}
                onChange={(e) => {
                  setNewCompany({
                    ...newCompany,
                    openings: e.target.value,
                  });
                }}
              />
            </div>

            <button type="submit" className="primary-button">
              Register Company
            </button>
          </form>
        </section>
      )}

      {/* Edit form only opens for the recruiter's own company */}
      {user?.role === "RECRUITER" && editingCompany && (
        <section className="company-form-section company-edit-section">
          <h2>Edit Company</h2>

          <form className="company-form" onSubmit={updateCompany}>
            <div className="company-form-group">
              <label>Company Name</label>

              <input
                type="text"
                value={editingCompany.name}
                onChange={(e) => {
                  setEditingCompany({
                    ...editingCompany,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Hiring Location</label>

              <input
                type="text"
                value={editingCompany.location}
                onChange={(e) => {
                  setEditingCompany({
                    ...editingCompany,
                    location: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Package Per Annum</label>

              <input
                type="number"
                value={editingCompany.packageAmount ?? ""}
                onChange={(e) => {
                  setEditingCompany({
                    ...editingCompany,
                    packageAmount: e.target.value,
                  });
                }}
              />
            </div>

            <div className="company-form-group">
              <label>Number of Openings</label>

              <input
                type="number"
                value={editingCompany.openings}
                onChange={(e) => {
                  setEditingCompany({
                    ...editingCompany,
                    openings: e.target.value,
                  });
                }}
              />
            </div>

            <button type="submit" className="primary-button">
              Update Company
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default Companies;