import axios from 'axios';
import { Place } from '../types/Place';

const API_URL = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem('token');

export const PlaceService = {
  getAll: async (
    page = 1,
    limit = 10
  ): Promise<{
    data: Place[];
    totalPages: number;
    currentPage: number;
  }> => {
    const res = await axios.get(
      `${API_URL}/places?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return res.data; // se espera que venga en forma { data, totalPages, currentPage }
  },

  create: async (place: Partial<Place>): Promise<Place> => {
    const res = await axios.post(`${API_URL}/places`, place, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return res.data;
  },

  update: async (id: string, place: Partial<Place>): Promise<Place> => {
    const res = await axios.put(`${API_URL}/places/${id}`, place, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/places/${id}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
  },
};
