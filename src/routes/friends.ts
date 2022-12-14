import express from 'express';
import controller from '../controllers/friends';
import { auth } from '../middlewares/authentication';

const router = express.Router();

router.get('/get/friendslist', auth, controller.getFriendsList)

export = router;