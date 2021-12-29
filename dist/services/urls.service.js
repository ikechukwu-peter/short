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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const shorten_model_1 = __importDefault(require("../model/shorten.model"));
const encryption_1 = __importDefault(require("../lib/encryption"));
//URLS class that handles all the url methods
class URLS {
    constructor() {
        this.relative_filename = "../lib/random.ts";
        this.fullPath = path_1.default.resolve(__dirname, this.relative_filename);
    }
    urlShortener(urlToShorten) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let child = (0, child_process_1.fork)(this.fullPath);
                child.on("message", (msg) => __awaiter(this, void 0, void 0, function* () {
                    if (!urlToShorten.startsWith("http"))
                        urlToShorten = "https:" + "//" + urlToShorten;
                    let urlHash = (0, encryption_1.default)(msg);
                    let hashCheck = yield shorten_model_1.default.findOne({ shorturl: urlHash });
                    if (hashCheck) {
                        return Promise.reject("That is a Nip link.");
                    }
                    let urlData = yield shorten_model_1.default.create({
                        shorturl: urlHash,
                        longurl: urlToShorten,
                    });
                    if (urlData) {
                        //send response
                        return resolve(msg);
                    }
                    else {
                        return reject("Error creating url");
                    }
                }));
                child.send("start");
                child.on("close", (code) => {
                    console.log(`Child closed with the code ${code}`);
                });
            });
        });
    }
    urlShortenerCustom(urlToShorten, custom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!urlToShorten.startsWith("http"))
                    urlToShorten = "https:" + "//" + urlToShorten;
                let urlHash = (0, encryption_1.default)(custom);
                let data = yield shorten_model_1.default.findOne({ shorturl: urlHash });
                if (data === null) {
                    yield shorten_model_1.default.create({
                        shorturl: urlHash,
                        longurl: urlToShorten,
                    });
                    return Promise.resolve(custom);
                }
                else {
                    return Promise.reject(`Custom already used.`);
                }
            }
            catch (err) {
                return Promise.reject(`Error occured`);
            }
        });
    }
    urlExpander(expandUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expandUrl.startsWith("http"))
                expandUrl = "https:" + "//" + expandUrl;
            return new Promise((resolve, reject) => {
                (0, request_1.default)({
                    url: expandUrl,
                    method: "HEAD",
                    followAllRedirects: true,
                }, (err, response, body) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(response.request.href);
                });
            });
        });
    }
    urlForwarder(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let urlHash = (0, encryption_1.default)(url);
                let urlData = yield shorten_model_1.default.findOne({ shorturl: urlHash });
                if (urlData !== null) {
                    urlData.accessed++;
                    urlData.save();
                    return Promise.resolve(urlData.longurl);
                }
                else {
                    return Promise.reject("No url found");
                }
            }
            catch (err) {
                console.log(err);
                return Promise.reject(err.message);
            }
        });
    }
}
const urls = new URLS();
exports.default = urls;
