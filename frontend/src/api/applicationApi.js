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



export const getCompanyApplicationReviews = async (companyId) => {
  const response = await fetch(
    `${API_URL}/api/applications/company/${companyId}/reviews`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to fetch company applications",
    );
  }

  return await response.json();
};

export const updateApplicationStatus = async (
  companyId,
  applicationId,
  status,
) => {
  const response = await fetch(
    `${API_URL}/api/applications/company/${companyId}/application/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to update application status",
    );
  }

  return await response.json();
};
