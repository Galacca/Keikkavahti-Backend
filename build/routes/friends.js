"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var friends_1 = __importDefault(require("../controllers/friends"));
var authentication_1 = require("../middlewares/authentication");
var router = express_1.default.Router();
router.get('/get/friendslist', authentication_1.auth, friends_1.default.getFriendsList);
module.exports = router;
