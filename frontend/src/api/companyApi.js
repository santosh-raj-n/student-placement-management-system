const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
  const response = await fetch(`${API_URL}/api/companies`);

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return await response.json();
};

export const createCompany = async (company) => {
  const response = await fetch(`${API_URL}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(JSON.stringify(errors));
  }

  return await response.json();
};

export const updateCompany = async (id, company) => {
  const response = await fetch(`${API_URL}/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(JSON.stringify(errors));
  }

  return await response.json();
};

export const deleteCompany = async (id) => {
  const response = await fetch(`${API_URL}/api/companies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete company");
  }
};
