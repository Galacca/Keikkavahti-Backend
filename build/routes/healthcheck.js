"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var healthCheck_1 = __importDefault(require("../controllers/healthCheck"));
var router = express_1.default.Router();
router.get("/", healthCheck_1.default.healthCheck);
module.exports = router;
