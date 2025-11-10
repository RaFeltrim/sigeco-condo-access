import { Router } from 'express';
import authRoutes from './auth.routes';
import residentsRoutes from './residents.routes';
import appointmentsRoutes from './appointments.routes';
import visitsRoutes from './visits.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/residents', residentsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/visits', visitsRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
