"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var gigs_1 = __importDefault(require("../controllers/gigs"));
var authentication_1 = require("../middlewares/authentication");
var router = express_1.default.Router();
router.get('/get/allgigs', gigs_1.default.getAllGigs);
router.post('/get/bymonth', gigs_1.default.getGigsByMonth);
router.post('/post/tagGig', authentication_1.auth, gigs_1.default.tagGig);
router.post('/post/getTaggedGigs', authentication_1.auth, gigs_1.default.getUsersTaggedGigs);
module.exports = router;
