"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//@ts-ignore
const helmet_1 = __importDefault(require("helmet"));
//@ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const compression_1 = __importDefault(require("compression"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const app = (0, express_1.default)();
//setting static files
app.use(express_1.default.static("public"));
// view engine setup
app.set("views", "views");
app.set("view engine", "pug");
//Body parser, reading data from req.body
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
//compress app
app.use((0, compression_1.default)());
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to API calls only
// Routing
app.use(apiLimiter);
app.use(url_routes_1.default);
exports.default = app;
