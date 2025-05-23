import express from 'express';
import { searchHouseholds, searchCitizens } from '../controller/search.controller.js';

const router = express.Router();

// Route tìm kiếm hộ khẩu
// GET /api/search/households?apartment=201&floor=2&head=Nguyen&phone=090&members=3
router.get('/households', searchHouseholds);

// Route tìm kiếm nhân khẩu  
// GET /api/search/citizens?name=Nguyen&citizenId=001&gender=Nam&apartment=201&dob=1980-05-15&relation=Con&householdId=1
router.get('/citizens', searchCitizens);

export default router;