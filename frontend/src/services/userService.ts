import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export type User = {
  id: number;
  name: string;
  email: string;
  balance: number;
};

export async function getUserById(id: number): Promise<User> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getUserRolesById(id: number): Promise<string[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users/${id}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
