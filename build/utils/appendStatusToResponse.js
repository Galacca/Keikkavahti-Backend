"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendStatusToResponse = void 0;
//This "appends" statuses from the relation table to the actual server response
//I felt like this is logic that needs to be handled in the backend instead of the frontend
var appendStatusToResponse = function (taggedGigsArray, simplifiedGigArray) {
    taggedGigsArray.map(function (g) {
        var entry = {
            status: g.status,
        };
        var index = simplifiedGigArray.findIndex(function (item) { return item.id === g.gigId; });
        Object.assign(simplifiedGigArray[index], entry);
    });
    return simplifiedGigArray;
};
exports.appendStatusToResponse = appendStatusToResponse;
