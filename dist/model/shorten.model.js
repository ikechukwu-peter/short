"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    shorturl: {
        type: String,
        required: true,
        unique: true,
    },
    longurl: {
        type: String,
        required: true,
    },
    accessed: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});
const ShortenModel = (0, mongoose_1.model)("shorten", schema);
exports.default = ShortenModel;
