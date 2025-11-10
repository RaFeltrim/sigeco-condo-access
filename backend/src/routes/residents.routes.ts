import { Router } from 'express';
import { ResidentsController } from '../controllers/residents.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const residentsController = new ResidentsController();

router.use(authenticate); // All routes require authentication

router.get('/', residentsController.getAll);
router.get('/:id', residentsController.getById);
router.post('/', authorize('ADMIN', 'SINDICO'), residentsController.create);
router.put('/:id', authorize('ADMIN', 'SINDICO'), residentsController.update);
router.delete('/:id', authorize('ADMIN', 'SINDICO'), residentsController.delete);

export default router;
