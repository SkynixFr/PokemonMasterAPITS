import { Router } from 'express';
import ClientsRouter from './clients.routes';

const router = Router();

router.use('/user', ClientsRouter);

export default router;
