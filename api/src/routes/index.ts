import { Router } from 'express';
import eventsRoutes from './events.route';

const router = Router();

router.use('/events', eventsRoutes);

export default router;
