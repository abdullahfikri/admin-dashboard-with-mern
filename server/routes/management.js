import { getAdmins, getUserPerformance } from '../controllers/management.js';
import express from 'express';
const router = express.Router();

router.get('/admins', getAdmins);
router.get('/performance/:id', getUserPerformance);
export default router;
