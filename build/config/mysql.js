"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempQuery = exports.ParamQuery = exports.GigQuery = exports.UserQuery = exports.Connect = void 0;
var mysql2_1 = __importDefault(require("mysql2"));
var config_1 = __importDefault(require("./config"));
var params = {
    user: config_1.default.mysql.user,
    password: config_1.default.mysql.pass,
    host: config_1.default.mysql.host,
    database: config_1.default.mysql.database
};
var Connect = function () {
    return new Promise(function (resolve, reject) {
        var connection = mysql2_1.default.createConnection(params);
        connection.connect(function (error) {
            if (error) {
                reject("No connection to the database could be established");
                return;
            }
            resolve(connection);
        });
    });
};
exports.Connect = Connect;
var UserQuery = function (connection, query) {
    return new Promise(function (resolve, reject) {
        connection.query(query, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
exports.UserQuery = UserQuery;
var TempQuery = function (connection, query) {
    return new Promise(function (resolve, reject) {
        connection.query(query, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
exports.TempQuery = TempQuery;
var GigQuery = function (connection, query) {
    return new Promise(function (resolve, reject) {
        connection.query(query, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
exports.GigQuery = GigQuery;
var ParamQuery = function (connection, query, pArray) {
    return new Promise(function (resolve, reject) {
        connection.query(query, pArray, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
exports.ParamQuery = ParamQuery;
