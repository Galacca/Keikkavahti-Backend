import express from 'express';
import controller from '../controllers/gigs';
import { auth } from '../middlewares/authentication';

const router = express.Router();
router.get('/get/allgigs', controller.getAllGigs);
router.post('/get/bymonth', controller.getGigsByMonth);
router.post('/post/tagGig', auth, controller.tagGig)
router.post('/post/getTaggedGigs', auth, controller.getUsersTaggedGigs)

export = router;