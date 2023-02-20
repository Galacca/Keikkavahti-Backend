"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var config_1 = __importDefault(require("./config/config"));
var gigs_1 = __importDefault(require("./routes/gigs"));
var users_1 = __importDefault(require("./routes/users"));
var friends_1 = __importDefault(require("./routes/friends"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var router = (0, express_1.default)();
var corsOpts = {
    origin: 'http://127.0.0.1:5173',
    methods: [
        'GET',
        'POST',
    ],
    allowedHeaders: [
        'Content-Type', 'Authorization',
    ],
};
router.use((0, cors_1.default)(corsOpts));
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json());
router.use('/users', users_1.default);
router.use('/gigs', gigs_1.default);
router.use('/friends', friends_1.default);
router.use(function (req, res, next) {
    var error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
var httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, function () { return console.log("Server is running ".concat(config_1.default.server.hostname, ":").concat(config_1.default.server.port)); });
