"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("../config/mysql");
var UserSchema_1 = require("../schema/UserSchema");
var argon2_1 = __importDefault(require("argon2"));
var signToken_1 = require("../utils/signToken");
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, findUserQuery, queriedUser, user, valid, error_1, userForToken, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    UserSchema_1.LoginSchema.parse(req.body);
                }
                catch (error) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(error.issues.map(function (issue) { return ({ message: issue.message, field: issue.path.join() }); }))];
                }
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 1:
                connection = _a.sent();
                findUserQuery = "SELECT * FROM users WHERE username = " + connection.escape(req.body.username.toLowerCase()) + "";
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, findUserQuery)
                    //user can end up as undefined, but we catch it early and throw. Still not the best solution? Not sure.
                ];
            case 2:
                queriedUser = _a.sent();
                user = queriedUser[0];
                connection.end();
                try {
                    if (!user)
                        throw new Error('Username does not exist');
                }
                catch (error) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: error.message, field: 'username' })];
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, argon2_1.default.verify(user.password, req.body.password)];
            case 4:
                valid = _a.sent();
                if (!valid)
                    throw new Error("Invalid password");
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_1.message, field: 'password' })];
            case 6:
                try {
                    userForToken = {
                        name: user.name,
                        id: user.id,
                    };
                    token = (0, signToken_1.signToken)(userForToken);
                    return [2 /*return*/, res
                            .status(200)
                            .json({ token: token, user: user.username, id: user.id, name: user.name })];
                }
                catch (error) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: error.message, field: 'username' })];
                }
                return [2 /*return*/];
        }
    });
}); };
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, duplicateUserQuery, duplicateUsername, error_2, duplicateNameQuery, duplicateName, error_3, hashedPassword, insertNewUserquery, findUserQuery, queriedUser, user, userForToken, token, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    UserSchema_1.SignUpSchema.parse(req.body);
                }
                catch (error) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(error.issues.map(function (issue) { return ({ message: issue.message, field: issue.path.join() }); }))];
                }
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 1:
                connection = _a.sent();
                duplicateUserQuery = "SELECT EXISTS(SELECT \"username\" FROM users WHERE username = " + connection.escape(req.body.username) + ") as TRUTH";
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, duplicateUserQuery)];
            case 3:
                duplicateUsername = _a.sent();
                if (Object.values(duplicateUsername[0]).includes(1))
                    throw new Error('Username already exists');
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                connection.end();
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_2.message, field: 'username' })];
            case 5:
                duplicateNameQuery = "SELECT EXISTS(SELECT \"username\" FROM users WHERE name = " + connection.escape(req.body.name) + ") as TRUTH";
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, duplicateNameQuery)];
            case 7:
                duplicateName = _a.sent();
                if (Object.values(duplicateName[0]).includes(1))
                    throw new Error('Name/handle already exists');
                return [3 /*break*/, 9];
            case 8:
                error_3 = _a.sent();
                connection.end();
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_3.message, field: 'name' })];
            case 9:
                _a.trys.push([9, 13, , 14]);
                return [4 /*yield*/, argon2_1.default.hash(req.body.password)
                    //Escape the hashed password since it can contain special characters that confuse the query
                ];
            case 10:
                hashedPassword = _a.sent();
                insertNewUserquery = "INSERT INTO users (username, password, name) VALUES (".concat(connection.escape(req.body.username.toLowerCase()), ",").concat(connection.escape(hashedPassword), ",").concat(connection.escape(req.body.name), ")");
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, insertNewUserquery)
                    //Get the newly inserted data so we can sign them in right away. We have to do this since we do not know the ID otherwise.
                ];
            case 11:
                _a.sent();
                findUserQuery = "SELECT * FROM users WHERE username = " + connection.escape(req.body.username.toLowerCase()) + "";
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, findUserQuery)];
            case 12:
                queriedUser = _a.sent();
                user = queriedUser[0];
                console.log(user);
                connection.end();
                userForToken = {
                    name: user.name,
                    id: user.id,
                };
                token = (0, signToken_1.signToken)(userForToken);
                return [2 /*return*/, res
                        .status(200)
                        .json({ token: token, user: user.username, id: user.id, name: user.name })];
            case 13:
                error_4 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_4.message, field: 'critical' })];
            case 14: return [2 /*return*/];
        }
    });
}); };
var addFriend = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var friendRequester, friendToAdd, connection, newFriendExistsQuery, newFriendExistsResult, userIsFriendToAddQuery, userIsFriendToAddResult, duplicateFriendQuery, duplicateFriendResult, addNewFriendQuery, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                friendRequester = req.body.decodedToken.id;
                friendToAdd = req.body.friendToAddName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 2:
                connection = _a.sent();
                newFriendExistsQuery = "SELECT EXISTS(SELECT name FROM users WHERE name = ".concat(connection.escape(friendToAdd), ") as TRUTH");
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, newFriendExistsQuery)];
            case 3:
                newFriendExistsResult = _a.sent();
                if (newFriendExistsResult[0].TRUTH === 0)
                    throw new Error("User named " + friendToAdd + " does not exist.");
                userIsFriendToAddQuery = "SELECT id FROM users WHERE name = ".concat(connection.escape(friendToAdd));
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, userIsFriendToAddQuery)];
            case 4:
                userIsFriendToAddResult = _a.sent();
                if (userIsFriendToAddResult[0].id === friendRequester)
                    throw new Error("You cannot add yourself as your friend.");
                duplicateFriendQuery = "SELECT EXISTS(SELECT id FROM friends WHERE friendName = " + connection.escape(friendToAdd) + " AND userId = " + connection.escape(friendRequester) + ") as TRUTH";
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, duplicateFriendQuery)];
            case 5:
                duplicateFriendResult = _a.sent();
                if (duplicateFriendResult[0].TRUTH === 1)
                    throw new Error("User named " + friendToAdd + " is already on your friends list.");
                addNewFriendQuery = "INSERT INTO friends (userId, friendName) VALUES (".concat(connection.escape(friendRequester), ",").concat(connection.escape(friendToAdd), ")");
                console.log(addNewFriendQuery);
                return [4 /*yield*/, (0, mysql_1.UserQuery)(connection, addNewFriendQuery)];
            case 6:
                _a.sent();
                connection.end();
                return [2 /*return*/, res
                        .status(201)
                        .json("New friend added succesfully")];
            case 7:
                error_5 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_5.message, field: 'friendToAddName' })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.default = { login: login, signup: signup, addFriend: addFriend };
