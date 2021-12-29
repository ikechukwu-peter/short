"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urls_controller_1 = __importDefault(require("../controllers/urls.controller"));
const route = (0, express_1.Router)();
route.get("/", urls_controller_1.default.index);
route.get("/shorten", urls_controller_1.default.urlShortener);
route.get("/expand", urls_controller_1.default.urlExpander);
route.get("/:urlToForward", urls_controller_1.default.urlForwarder);
route.get("*", urls_controller_1.default.urlDoNotExist);
exports.default = route;
