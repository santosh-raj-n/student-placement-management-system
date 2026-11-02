
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanies, updateCompany } from "../api/companyApi";
import "../styles/Companies.css";

const DEPARTMENT_OPTIONS = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "AI&DS",
  "CSE AI&ML",
  "Computer Science",
  "Computer Applications",
];

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const companies = await getCompanies();
        const selectedCompany = companies.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedCompany) {
          setError("Company not found");
          return;
        }

        setCompany({
          ...selectedCompany,
          eligibleDepartments: selectedCompany.eligibleDepartments || [],
          anyDepartmentEligible:
            selectedCompany.anyDepartmentEligible ?? true,
        });
      } catch (err) {
        setError(err.message || "Failed to load company");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (department) => {
    setCompany((prev) => ({
      ...prev,
      eligibleDepartments: prev.eligibleDepartments.includes(department)
        ? prev.eligibleDepartments.filter((item) => item !== department)
        : [...prev.eligibleDepartments, department],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const companyData = {
        name: company.name,
        location: company.location,
        openings: Number(company.openings),
        packageAmount: Number(company.packageAmount),
        anyDepartmentEligible: company.anyDepartmentEligible,
        eligibleDepartments: company.anyDepartmentEligible
          ? []
          : company.eligibleDepartments,
      };

      await updateCompany(id, companyData);
      navigate("/company");
    } catch (err) {
      setError(err.message || "Failed to update company");
    }
  };

  if (loading) {
    return <p>Loading company details...</p>;
  }

  if (!company) {
    return (
      <main className="companies-page">
        <p className="status-message error-message">
          {error || "Company not found"}
        </p>
        <button onClick={() => navigate("/company")}>Back to Companies</button>
      </main>
    );
  }

  return (
    <main className="companies-page">
      <section className="company-form-section">
        <h2>Edit Company</h2>

        {error && (
          <div className="status-message error-message">{error}</div>
        )}

        <form className="company-form" onSubmit={handleUpdate}>
          <div className="company-form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-form-group">
            <label>Hiring Location</label>
            <input
              type="text"
              name="location"
              value={company.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-form-group">
            <label>Package Per Annum</label>
            <input
              type="number"
              name="packageAmount"
              value={company.packageAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-form-group">
            <label>Number of Openings</label>
            <input
              type="number"
              name="openings"
              value={company.openings}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-form-group">
            <label>
              <input
                type="checkbox"
                checked={company.anyDepartmentEligible}
                onChange={(e) =>
                  setCompany((prev) => ({
                    ...prev,
                    anyDepartmentEligible: e.target.checked,
                  }))
                }
              />
              Any department can apply
            </label>
          </div>

          {!company.anyDepartmentEligible && (
            <div className="company-form-group">
              <label>Eligible Departments</label>

              {DEPARTMENT_OPTIONS.map((department) => (
                <label key={department}>
                  <input
                    type="checkbox"
                    checked={company.eligibleDepartments.includes(department)}
                    onChange={() => handleDepartmentChange(department)}
                  />
                  {department}
                </label>
              ))}
            </div>
          )}

          <button type="submit" className="primary-button">
            Update Company
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/company")}
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
};

export default EditCompany;
