const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const applyToCompany = async (companyId) => {
  const response = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      companyId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message || "Failed to apply",
    );
  }

  return await response.json();
};

export const getMyApplications = async () => {
  const response = await fetch(`${API_URL}/api/applications/my`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return await response.json();
};