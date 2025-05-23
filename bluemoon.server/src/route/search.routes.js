import express from 'express';
import { searchHouseholds, searchCitizens } from '../controller/search.controller.js';

const router = express.Router();

router.get('/households', searchHouseholds);
router.get('/citizens', searchCitizens);

export default router;
