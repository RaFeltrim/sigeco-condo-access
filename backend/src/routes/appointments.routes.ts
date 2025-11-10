import { Router } from 'express';
import { AppointmentsController } from '../controllers/appointments.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const appointmentsController = new AppointmentsController();

router.use(authenticate);

router.get('/', appointmentsController.getAll);
router.post('/', appointmentsController.create);
router.put('/:id', appointmentsController.update);
router.delete('/:id', appointmentsController.delete);

export default router;
