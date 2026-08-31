import React, { useEffect, useState } from "react";
import { getMyApplications } from "../api/applicationApi";
import { getCompanies } from "../api/companyApi";

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>You have not applied to any companies yet.</p>
      ) : (
        applications.map((application) => {
          const company = companies.find(
            (company) => company.id === application.companyId
          );

          return (
            <div key={application.id}>
              <h2>{company ? company.name : "Company not found"}</h2>

              {company && (
                <>
                  <p>Location: {company.location}</p>
                  <p>Package: {company.packageAmount} LPA</p>
                </>
              )}

              <p>Application Status: {application.status}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Applications;