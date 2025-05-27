import axios from 'axios';
import { Report } from '../types/Report';

export const ReportService = {
  async getMyReports(): Promise<Report[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  },
};
