const API_URL = import.meta.env.VITE_API_URL;

export const getStats = async () => {
    const response = await fetch(`${API_URL}/api/stat`);

    if (!response.ok) {
        throw new Error("Failed to fetch statistics");
    }

    return await response.json();
};