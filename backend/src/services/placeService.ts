import { Place } from '../models/Place';
import { CreatePlaceDTO } from '../schemas/Place/createPlaceSchema';
import { UpdatePlaceDTO } from '../schemas/Place/updatePlaceSchema';

export class PlaceService {
  static async getAllPlaces(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Place.findAndCountAll({
      limit,
      offset,
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

  static async getPlaceByPk(id: string) {
    const place = await Place.findByPk(id);
    return place;
  }

  static async createPlace(data: CreatePlaceDTO) {
    const place = await Place.create(data);
    return place;
  }

  static async updatePlace(id: string, data: UpdatePlaceDTO) {
    const [affectedRows] = await Place.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedPlace = await Place.findByPk(id);
    return updatedPlace;
  }

  static async deletePlace(id: string) {
    const affectedRows = await Place.destroy({ where: { id } });
    return affectedRows > 0;
  }
}
