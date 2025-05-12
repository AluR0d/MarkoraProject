import { Request, Response } from 'express';
import { PlaceService } from '../services/placeService';
import { createPlaceSchema } from '../schemas/Place/createPlaceSchema';
import { updatePlaceSchema } from '../schemas/Place/updatePlaceSchema';
import { defaultValues } from '../constants/defaultValues';

export class PlaceController {
  getAllPlaces = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || defaultValues.d_page;
    const limit = parseInt(req.query.limit as string) || defaultValues.d_limit;
    try {
      const result = await PlaceService.getAllPlaces(page, limit);

      if (result.data.length === 0) {
        res.status(404).json({ message: 'No places found' });
        return;
      }

      res.status(200).json(result);
      return;
    } catch (error) {
      console.error(`Error fetching places: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  getAllPlacesNotPaginated = async (_req: Request, res: Response) => {
    try {
      const places = await PlaceService.getAllPlacesNotPaginated();
      if (places.length === 0) {
        res.status(404).json({ message: 'No places found' });
        return;
      }

      res.status(200).json(places);
      return;
    } catch (error) {
      console.error(`Error fetching places: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  getPlaceByPk = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const place = await PlaceService.getPlaceByPk(id);
      if (!place) {
        res.status(404).json({ message: 'Place not found' });
        return;
      }

      res.status(200).json(place);
      return;
    } catch (error) {
      console.error(`Error fetching place: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  createPlace = async (req: Request, res: Response) => {
    const result = createPlaceSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    } else {
      try {
        const newPlace = await PlaceService.createPlace(result.data);

        res.status(201).json(newPlace);
        return;
      } catch (error) {
        console.error(`Error creating place: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  updatePlace = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = updatePlaceSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    try {
      const existingPlace = await PlaceService.getPlaceByPk(id);
      if (!existingPlace) {
        res.status(404).json({ message: 'Place not found' });
        return;
      }

      const updatedPlace = await PlaceService.updatePlace(id, result.data);
      if (!updatedPlace) {
        res.status(404).json({ message: 'Failed to update place' });
        return;
      }

      res.status(200).json(updatedPlace);
      return;
    } catch (error) {
      console.error(`Error updating place: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  deletePlace = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const existingPlace = await PlaceService.getPlaceByPk(id);
      if (!existingPlace) {
        res.status(404).json({ message: 'Place not found' });
        return;
      }

      const deletedPlace = await PlaceService.deletePlace(id);
      if (!deletedPlace) {
        res.status(400).json({ message: 'No place was deleted' });
        return;
      }

      res.status(200).json({ message: 'Place deleted successfully' });
      return;
    } catch (error) {
      console.error(`Error deleting place: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
