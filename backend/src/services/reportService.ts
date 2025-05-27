import { Report } from '../models/Report';

export const ReportService = {
  async create({
    title,
    range,
    user_id,
    data_snapshot,
  }: {
    title: string;
    range: string;
    user_id: number;
    data_snapshot?: any;
  }) {
    return await Report.create({ title, range, user_id, data_snapshot });
  },

  async findByUser(user_id: number) {
    return await Report.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });
  },
};
