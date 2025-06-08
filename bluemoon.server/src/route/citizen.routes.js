import express from 'express';
import {
  getAllCitizens,
  getCitizenById,
  createCitizen,
  updateCitizen,
  deleteCitizen,
  // getCitizenHistory
} from '../controller/citizen.controller.js';

const router = express.Router();

router.get('/', getAllCitizens);
router.get('/:id', getCitizenById);
router.post('/add', createCitizen);
router.put('/:id', updateCitizen);
router.delete('/:id', deleteCitizen);
// router.get('/:id/history', getCitizenHistory);

export default router;
