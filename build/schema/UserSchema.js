"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = exports.LoginSchema = void 0;
var zod_1 = require("zod");
var alphanumerical = /^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
var regExpError = "Only alphanumerical characters allowed";
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string().max(15).min(4).regex(alphanumerical, regExpError),
    password: zod_1.z.string().max(30).min(5),
});
exports.SignUpSchema = zod_1.z.object({
    username: zod_1.z.string().max(15).min(4).regex(alphanumerical, regExpError),
    password: zod_1.z.string().max(30).min(5),
    name: zod_1.z.string().max(15).min(3).regex(alphanumerical, regExpError),
});
