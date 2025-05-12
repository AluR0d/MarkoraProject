import { Router } from 'express';
import { PlaceController } from '../controllers/placeController';

const router = Router();
const placeController = new PlaceController();

router.get('/', placeController.getAllPlaces);
router.get('/raw', placeController.getAllPlacesNotPaginated);
router.get('/:id', placeController.getPlaceByPk);
router.post('/', placeController.createPlace);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);

export default router;
