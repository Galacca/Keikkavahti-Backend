import express from 'express';
import controller from '../controllers/gigs';

const router = express.Router();
router.get('/get/allgigs', controller.getAllGigs);
router.post('/get/bymonth', controller.getGigsByMonth);

export = router;