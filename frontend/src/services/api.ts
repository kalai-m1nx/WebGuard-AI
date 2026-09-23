const API_URL = 'https://webguard-ai-dn8h.onrender.com/api';

export const scanUrl = async (url: string) => {
  const response = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    throw new Error('Failed to scan URL');
  }
  return response.json();
};

export const getScan = async (id: string) => {
  const response = await fetch(`${API_URL}/scan/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch scan results');
  }
  return response.json();
};

export const getHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
};

export const getDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};
