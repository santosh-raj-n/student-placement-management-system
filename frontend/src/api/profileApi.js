const API_URL = import.meta.env.VITE_API_URL;

export const getStudentProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your session could not be verified. Please sign in again.");
    }
    if (response.status === 404) {
      throw new Error("We couldn't find your profile information.");
    }
    throw new Error("We couldn't load your profile. Please try again later.");
  }

  return response.json();
};

export const updateStudentProfile = async (profile) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: profile.name,
      degree: profile.degree,
      department: profile.department,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Enter a name, degree, and department to save your profile.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your session could not be verified. Please sign in again.");
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "We couldn't save your profile. Please try again.");
  }

  return response.json();
};
