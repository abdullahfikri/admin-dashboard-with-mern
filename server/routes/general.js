import express from 'express';
import { getUser, getDashboardStat } from '../controllers/general.js';
const router = express.Router();
router.get('/user/:id', getUser);
router.get('/dashboard', getDashboardStat);
export default router;
