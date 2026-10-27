
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCompanies } from "../api/companyApi";
import {
  getCompanyApplicationReviews,
  updateApplicationStatus,
} from "../api/applicationApi";

const RecruiterApplications = () => {
  const { user } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const allCompanies = await getCompanies();

        // Show only companies owned by the logged-in recruiter
        const myCompanies = allCompanies.filter(
          (company) => String(company.recruiterId) === String(user?.id)
        );

        setCompanies(myCompanies);

        const results = await Promise.all(
          myCompanies.map(async (company) => {
            const reviews = await getCompanyApplicationReviews(company.id);

            return {
              companyId: company.id,
              reviews,
            };
          })
        );

        const applicationMap = {};

        results.forEach((result) => {
          applicationMap[result.companyId] = result.reviews;
        });

        setApplications(applicationMap);
      } catch (err) {
        setError(err.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.role === "RECRUITER") {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleStatusUpdate = async (
    companyId,
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const updatedApplication = await updateApplicationStatus(
        companyId,
        applicationId,
        status
      );

      setApplications((previous) => ({
        ...previous,
        [companyId]: (previous[companyId] || []).map((application) =>
          application.applicationId === applicationId
            ? { ...application, status: updatedApplication.status }
            : application
        ),
      }));
    } catch (err) {
      setError(err.message || "Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role !== "RECRUITER") {
    return (
      <main className="recruiter-applications-page">
        <h1>Recruiter Access Required</h1>
        <p>Please log in with a recruiter account to review applications.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="recruiter-applications-page">
        <h1>Applications Received</h1>
        <p>Loading applications...</p>
      </main>
    );
  }

  return (
    <main className="recruiter-applications-page">
      <header>
        <h1>Applications Received</h1>
        <p>Review applicants for your registered companies.</p>
      </header>

      {error && (
        <p role="alert" className="status-message error-message">
          {error}
        </p>
      )}

      {companies.length === 0 ? (
        <p>You haven't registered any companies yet.</p>
      ) : (
        companies.map((company) => {
          const companyApplications = applications[company.id] || [];

          return (
            <section key={company.id} className="recruiter-company-section">
              <h2>{company.name}</h2>
              <p>Location: {company.location}</p>

              {companyApplications.length === 0 ? (
                <p>No applications received for this company yet.</p>
              ) : (
                <div className="recruiter-applications-list">
                  {companyApplications.map((application) => (
                    <article
                      key={application.applicationId}
                      className="recruiter-application-card"
                    >
                      <h3>{application.studentName}</h3>

                      <p>
                        <strong>Email:</strong>{" "}
                        {application.studentEmail}
                      </p>

                      <p>
                        <strong>Application ID:</strong>{" "}
                        {application.applicationId}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {application.status}
                      </p>

                      <div className="recruiter-application-actions">
                        <button
                          type="button"
                          disabled={
                            updatingId === application.applicationId ||
                            application.status === "ACCEPTED"
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              company.id,
                              application.applicationId,
                              "ACCEPTED"
                            )
                          }
                        >
                          {updatingId === application.applicationId
                            ? "Updating..."
                            : "Accept"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            updatingId === application.applicationId ||
                            application.status === "REJECTED"
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              company.id,
                              application.applicationId,
                              "REJECTED"
                            )
                          }
                        >
                          {updatingId === application.applicationId
                            ? "Updating..."
                            : "Reject"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
};

export default RecruiterApplications;
