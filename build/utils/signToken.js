"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var signToken = function (userForToken) {
    var token = jsonwebtoken_1.default.sign(userForToken, process.env.TOKEN_SECRET);
    console.log(token);
    return token;
};
exports.signToken = signToken;
