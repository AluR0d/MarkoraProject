import { Place } from '../models/Place';
import { CreatePlaceDTO } from '../schemas/Place/createPlaceSchema';
import { UpdatePlaceDTO } from '../schemas/Place/updatePlaceSchema';
import { Op } from 'sequelize';

export class PlaceService {
  static async getAllPlaces(
    page = 1,
    limit = 10,
    filters: {
      name?: string;
      zone?: string;
      rating?: number;
      active?: boolean;
    } = {},
    orderBy?: string,
    order: 'asc' | 'desc' = 'asc'
  ) {
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.zone) {
      where.zone = { [Op.iLike]: `%${filters.zone}%` };
    }

    if (filters.rating !== undefined) {
      where.rating = { [Op.gte]: filters.rating };
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    const orderOption: [string, 'ASC' | 'DESC'][] = orderBy
      ? [[orderBy, order.toUpperCase() as 'ASC' | 'DESC']]
      : [];

    const { count, rows } = await Place.findAndCountAll({
      where,
      limit,
      offset,
      order: orderOption,
    });

    return {
      total: count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  static async getAllPlacesNotPaginated() {
    const places = await Place.findAll();
    return places;
  }

  static async getPlaceByPk(id: number) {
    const place = await Place.findByPk(id);
    return place;
  }

  static async createPlace(data: CreatePlaceDTO) {
    const place = await Place.create(data);
    return place;
  }

  static async updatePlace(id: number, data: UpdatePlaceDTO) {
    const [affectedRows] = await Place.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedPlace = await Place.findByPk(id);
    return updatedPlace;
  }

  static async deletePlace(id: number) {
    const affectedRows = await Place.destroy({ where: { id } });
    return affectedRows > 0;
  }
}
