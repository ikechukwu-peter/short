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
const shorten_model_1 = __importDefault(require("../model/shorten.model"));
const urls_service_1 = __importDefault(require("../services/urls.service"));
const encryption_1 = __importDefault(require("../lib/encryption"));
class URLS {
    constructor() { }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render("index", { title: "Nip || Shorten and expand your url." });
        });
    }
    urlShortener(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //extract url to shorten and custom if any
            const { urlToShorten, custom } = req.query;
            let castUrl = urlToShorten;
            try {
                if (urlToShorten === undefined) {
                    res.status(400).json({ status: "fail", message: "Empty url not allowed." });
                }
                else {
                    if (castUrl.startsWith(`${req.protocol}://${req.headers.host}`)) {
                        res.status(403).json({ status: "fail", message: "That's a Nip link." });
                    }
                    else {
                        if (custom === undefined && urlToShorten !== undefined) {
                            console.log(urlToShorten);
                            let response = yield urls_service_1.default.urlShortener(urlToShorten);
                            //form the url to be sent to the client
                            let fullURL = `${req.protocol}://${req.headers.host}/${response}`;
                            res.status(201).send(fullURL);
                        }
                        else {
                            let customUrlHash = (0, encryption_1.default)(custom);
                            let data = yield shorten_model_1.default.findOne({ shorturl: customUrlHash });
                            if (data !== null) {
                                let errMessage = `Custom url ${custom} already used.`;
                                res.status(409).json({ status: "fail", message: errMessage });
                            }
                            else {
                                let customResp = yield urls_service_1.default.urlShortenerCustom(urlToShorten, custom);
                                //form the url to be sent to the client
                                let customURL = `${req.protocol}://${req.headers.host}/${customResp}`;
                                res.status(201).send(customURL);
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: "fail", error: err });
            }
        });
    }
    urlExpander(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //extract user shortened link
            const { query } = req.query;
            try {
                let response = yield urls_service_1.default.urlExpander(query);
                res.status(201).send(response);
            }
            catch (err) {
                console.log(err);
                if (err.code === "ENOTFOUND") {
                    res
                        .status(404)
                        .json({ status: "fail", message: "The requested URL was not found" });
                }
                else {
                    res.status(500).json({ status: "fail", message: "Something went wrong" });
                }
            }
        });
    }
    urlForwarder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //extract shortened link
            const { urlToForward } = req.params;
            try {
                let response = yield urls_service_1.default.urlForwarder(urlToForward);
                res.redirect(response);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: "fail", message: err });
            }
        });
    }
    urlDoNotExist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(404).json({
                status: "fail",
                message: `Requested route ${req.originalUrl} does not exist.`,
            });
        });
    }
}
const urlController = new URLS();
exports.default = urlController;
