import React, { useEffect, useState } from "react";
import { getMyApplications } from "../api/applicationApi";
import { getCompanies } from "../api/companyApi";

import "../styles/Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const [applicationData, companyData] = await Promise.all([
          getMyApplications(),
          getCompanies(),
        ]);

        setApplications(applicationData);
        setCompanies(companyData);
      } catch (error) {
        setError(error.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return (
      <main className="applications-page">
        <div className="applications-status">
          Loading applications...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="applications-page">
        <div className="applications-status applications-error">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="applications-page">
      <section className="applications-header">
        <div>
          <h1>My Applications</h1>

          <p>
            Track the companies you have applied to and monitor your
            application status.
          </p>
        </div>

        <div className="applications-count">
          <span>Total Applications</span>
          <strong>{applications.length}</strong>
        </div>
      </section>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h2>No Applications Yet</h2>

          <p>
            You have not applied to any companies yet. Explore available
            companies and start your placement journey.
          </p>
        </div>
      ) : (
        <section className="applications-grid">
          {applications.map((application) => {
            const company = companies.find(
              (company) => company.id === application.companyId
            );

            return (
              <article
                className="application-card"
                key={application.id}
              >
                <div className="application-card-header">
                  <div>
                    <h2>
                      {company
                        ? company.name
                        : "Company not found"}
                    </h2>

                    {company && (
                      <p className="application-location">
                        {company.location}
                      </p>
                    )}
                  </div>

                  <span
                    className={`application-status ${
                      application.status?.toLowerCase() || ""
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="application-details">
                  {company && (
                    <>
                      <div className="application-detail">
                        <span>Package</span>
                        <strong>
                          {company.packageAmount} LPA
                        </strong>
                      </div>

                      <div className="application-detail">
                        <span>Openings</span>
                        <strong>{company.openings}</strong>
                      </div>
                    </>
                  )}

                  <div className="application-detail">
                    <span>Application Status</span>

                    <strong>{application.status}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Applications;