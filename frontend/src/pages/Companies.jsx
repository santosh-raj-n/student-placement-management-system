import React, { useState, useEffect } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany as updateCompanyApi,
  deleteCompany as deleteCompanyApi,
} from "../api/companyApi";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    package: "",
    openings: "",
  });

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
    } catch (error) {
      const validationErrors = JSON.parse(error.message);
      setError(validationErrors);
    }
  };

  const deleteCompany = async (idToDelete) => {
    try {
      await deleteCompanyApi(idToDelete);

      const remainingCompanies = companies.filter((company) => {
        return company.id !== idToDelete;
      });

      setCompanies(remainingCompanies);
    } catch (error) {
      setError("Failed to delete company");
    }
  };

  const [editingCompany, setEditingCompany] = useState(null);

  const editCompany = (idToEdit) => {
    const companyToEdit = companies.find((company) => {
      return company.id === idToEdit;
    });
    setEditingCompany(companyToEdit);
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
        companyData,
      );

      const updatedCompanies = companies.map((company) => {
        if (company.id === updatedCompany.id) {
          return updatedCompany;
        }

        return company;
      });

      setCompanies(updatedCompanies);
      setEditingCompany(null);
    } catch (error) {
      try {
        const validationErrors = JSON.parse(error.message);
        setError(validationErrors);
      } catch {
        setError(error.message);
      }
    }
  };

  const totalOpenings = companies.reduce((total, company) => {
    return total + Number(company.openings);
  }, 0);

  return (
    <>
      {loading && <h2>Loading companies...</h2>}

      {error && typeof error === "string" && <h2>{error}</h2>}

      {error && typeof error === "object" && (
        <div>
          {Object.values(error).map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <h2>Total Companies: {companies.length}</h2>

      <h2>Total Openings: {totalOpenings}</h2>

      <h1>Companies That Are Hiring</h1>

      {companies.map((company) => (
        <div key={company.id}>
          <h2>{company.name}</h2>

          <p>Hiring Location: {company.location}</p>

          <p>Package: {company.packageAmount}</p>

          <p>No. of openings: {company.openings}</p>

          <button type="button" onClick={() => deleteCompany(company.id)}>
            Delete
          </button>

          <button type="button" onClick={() => editCompany(company.id)}>
            Edit
          </button>
        </div>
      ))}

      <form onSubmit={registerComp}>
        <div>
          <label>Company Name: </label>

          <input
            type="text"
            placeholder="Enter the Company Name"
            value={newCompany.name}
            onChange={(e) => {
              setNewCompany({
                ...newCompany,
                name: e.target.value,
              });
            }}
          />
        </div>

        <br />

        <div>
          <label>Openings Location: </label>

          <input
            type="text"
            placeholder="Enter the location for openings"
            value={newCompany.location}
            onChange={(e) => {
              setNewCompany({
                ...newCompany,
                location: e.target.value,
              });
            }}
          />
        </div>

        <br />

        <div>
          <label>Package per annum: </label>

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

        <br />

        <div>
          <label>No. of Openings: </label>

          <input
            type="number"
            placeholder="Enter no. of openings"
            value={newCompany.openings}
            onChange={(e) => {
              setNewCompany({
                ...newCompany,
                openings: e.target.value,
              });
            }}
          />
        </div>

        <br />

        <button type="submit">Register</button>
      </form>

      {editingCompany && (
        <div>
          <h2>Edit Company</h2>

          <form onSubmit={updateCompany}>
            <label>Edit Company Name: </label>

            <input
              type="text"
              placeholder="Edit the companies name"
              value={editingCompany.name}
              onChange={(e) => {
                setEditingCompany({
                  ...editingCompany,
                  name: e.target.value,
                });
              }}
            />

            <br />

            <label>Edit Opening location: </label>

            <input
              type="text"
              placeholder="Edit Location"
              value={editingCompany.location}
              onChange={(e) => {
                setEditingCompany({
                  ...editingCompany,
                  location: e.target.value,
                });
              }}
            />

            <br />

            <label>Edit package Details: </label>

            <input
              type="number"
              placeholder="Enter package details"
              value={editingCompany.packageAmount ?? ""}
              onChange={(e) => {
                setEditingCompany({
                  ...editingCompany,
                  packageAmount: e.target.value,
                });
              }}
            />

            <br />

            <label>Edit No. of Openings: </label>

            <input
              type="number"
              placeholder="Edit the no. of openings"
              value={editingCompany.openings}
              onChange={(e) => {
                setEditingCompany({
                  ...editingCompany,
                  openings: e.target.value,
                });
              }}
            />

            <br />

            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Companies;
