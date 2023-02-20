"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("../controllers/users"));
var authentication_1 = require("../middlewares/authentication");
var router = express_1.default.Router();
router.post('/post/login', users_1.default.login);
router.post('/post/signup', users_1.default.signup);
router.post('/post/addfriend', authentication_1.auth, users_1.default.addFriend);
module.exports = router;
