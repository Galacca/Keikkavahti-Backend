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
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("../config/mysql");
var appendStatusToResponse_1 = require("../utils/appendStatusToResponse");
var currentDate = new Date().toISOString();
var getAllGigs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, mysql_1.Connect)()
            .then(function (connection) {
            var query = "SELECT * FROM gigs WHERE date > \"".concat(currentDate, "\" ORDER BY date ASC");
            (0, mysql_1.GigQuery)(connection, query)
                .then(function (results) {
                return res
                    .status(200)
                    .json({
                    results: results
                });
            })
                .catch(function (error) {
                return res
                    .status(400)
                    .json({ message: "Query failure", field: 'critical' });
            })
                .finally(function () {
                connection.end();
            });
        })
            .catch(function (error) {
            return res
                .status(400)
                .json({ message: "Server status failure", field: 'critical' });
        });
        return [2 /*return*/];
    });
}); };
var getGigsByMonth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var highRange, lowRange;
    return __generator(this, function (_a) {
        highRange = req.body.year + "-".concat(req.body.month).concat("-32");
        lowRange = req.body.year + "-".concat(req.body.month).concat("-0");
        (0, mysql_1.Connect)()
            .then(function (connection) {
            var query = "SELECT * FROM gigs WHERE date < " + connection.escape(highRange) + " AND date > " + connection.escape(lowRange) + " ORDER BY date ASC";
            (0, mysql_1.GigQuery)(connection, query)
                .then(function (results) {
                return res
                    .status(200)
                    .json({
                    results: results
                });
            })
                .catch(function (error) {
                return res
                    .status(400)
                    .json({ message: "Query failure", field: 'critical' });
            })
                .finally(function () {
                connection.end();
            });
        })
            .catch(function (error) {
            return res
                .status(400)
                .json({ message: "Server failure", field: 'critical' });
        });
        return [2 /*return*/];
    });
}); };
var tagGig = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, gigId, operation, connection, duplicateTagQuery, isDuplicateTag, tagQuery, dateQuery, dateResult, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                userName = req.body.decodedToken.name;
                gigId = req.body.gigToTagId;
                operation = req.body.operation;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 2:
                connection = _a.sent();
                duplicateTagQuery = "SELECT status FROM taggedgigs WHERE gigId = ".concat(connection.escape(gigId), " AND userName = ").concat(connection.escape(userName));
                return [4 /*yield*/, (0, mysql_1.GigQuery)(connection, duplicateTagQuery)];
            case 3:
                isDuplicateTag = _a.sent();
                tagQuery = void 0;
                if (!(isDuplicateTag.length === 0)) return [3 /*break*/, 5];
                dateQuery = "SELECT date FROM gigs WHERE id = ".concat(connection.escape(gigId));
                return [4 /*yield*/, (0, mysql_1.GigQuery)(connection, dateQuery)
                    //Jesus christ help me. 
                ];
            case 4:
                dateResult = _a.sent();
                //Jesus christ help me. 
                tagQuery = "INSERT into taggedgigs (gigId, userName, status, date) VALUES (" + connection.escape(gigId) + ',' + connection.escape(userName) + ',' + connection.escape(operation) + ',' + connection.escape(dateResult[0].date) + ')';
                return [3 /*break*/, 6];
            case 5:
                if (isDuplicateTag[0].status === operation)
                    throw new Error('You are already tagged as ' + operation + ' this gig.');
                tagQuery = "UPDATE taggedgigs SET status = ".concat(connection.escape(operation), " WHERE gigId = ").concat(connection.escape(gigId), " AND userName = ").concat(connection.escape(userName));
                _a.label = 6;
            case 6: 
            //We do not need this is a variable since the frontend 'mimics' the database changes with state
            return [4 /*yield*/, (0, mysql_1.GigQuery)(connection, tagQuery)];
            case 7:
                //We do not need this is a variable since the frontend 'mimics' the database changes with state
                _a.sent();
                connection.end();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: 'Operation success' })];
            case 8:
                error_1 = _a.sent();
                console.log(error_1.message);
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_1.message, field: 'critical' })];
            case 9: return [2 /*return*/];
        }
    });
}); };
var getUsersTaggedGigs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, connection, getTaggedGigsQuery, getTaggedGigsResult, mappedResults, gigDataQuery, gigDataResult, appendedResponse, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.body.name;
                console.log(name);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 2:
                connection = _a.sent();
                getTaggedGigsQuery = "SELECT gigId, status FROM taggedgigs WHERE userName = ".concat(connection.escape(name), " AND date > \"").concat(currentDate, " ORDER BY date ASC\"");
                return [4 /*yield*/, (0, mysql_1.GigQuery)(connection, getTaggedGigsQuery)];
            case 3:
                getTaggedGigsResult = _a.sent();
                if (!(getTaggedGigsResult.length !== 0)) return [3 /*break*/, 5];
                mappedResults = getTaggedGigsResult.map(function (g) { return g.gigId; });
                gigDataQuery = "SELECT date, bands, id, venue FROM gigs WHERE id IN (".concat(mappedResults, ") ORDER BY date ASC");
                return [4 /*yield*/, (0, mysql_1.TempQuery)(connection, gigDataQuery)];
            case 4:
                gigDataResult = _a.sent();
                appendedResponse = (0, appendStatusToResponse_1.appendStatusToResponse)(getTaggedGigsResult, gigDataResult);
                connection.end();
                return [2 /*return*/, res
                        .status(200)
                        .json(appendedResponse)];
            case 5:
                connection.end;
                console.log("No tagged gigs found");
                return [2 /*return*/, res
                        .status(200)
                        .json("User has no tagged gigs")];
            case 6:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_2.message, field: 'critical' })];
            case 7: return [2 /*return*/];
        }
    });
}); };
var deleteTag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, gigId, connection, deleteTagQuery, deleteTagResult, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userName = req.body.decodedToken.name;
                gigId = req.body.gigToDeleteId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, mysql_1.Connect)()];
            case 2:
                connection = _a.sent();
                deleteTagQuery = "DELETE FROM taggedgigs WHERE userName = ".concat(connection.escape(userName), " AND gigId = \"").concat(gigId, "\"");
                return [4 /*yield*/, (0, mysql_1.GigQuery)(connection, deleteTagQuery)];
            case 3:
                deleteTagResult = _a.sent();
                connection.end();
                return [2 /*return*/, res
                        .status(200)
                        .json(deleteTagResult)];
            case 4:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: error_3.message, field: 'critical' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = { getAllGigs: getAllGigs, getGigsByMonth: getGigsByMonth, tagGig: tagGig, getUsersTaggedGigs: getUsersTaggedGigs, deleteTag: deleteTag };
