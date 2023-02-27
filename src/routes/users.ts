import express from "express";
import controller from "../controllers/users";
import { auth } from "../middlewares/authentication";

const router = express.Router();

router.post("/post/login", controller.login);
router.post("/post/signup", controller.signup);
router.post("/post/addfriend", auth, controller.addFriend);

export = router;
