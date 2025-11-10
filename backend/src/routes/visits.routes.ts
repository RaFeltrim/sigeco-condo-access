import { Router } from 'express';
import { VisitsController } from '../controllers/visits.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const visitsController = new VisitsController();

router.use(authenticate);

router.get('/', visitsController.getAll);
router.post('/', visitsController.create);
router.put('/:id/checkout', visitsController.checkOut);

export default router;
