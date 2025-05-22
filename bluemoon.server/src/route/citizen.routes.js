import express from 'express';
import {
  getAllCitizens,
  getCitizenById,
  createCitizen,
  updateCitizen,
  deleteCitizen
} from '../controller/citizen.controller.js';

const router = express.Router();

router.get('/', getAllCitizens);
router.get('/:id', getCitizenById);
router.post('/', createCitizen);
router.put('/:id', updateCitizen);
router.delete('/:id', deleteCitizen);

export default router;
