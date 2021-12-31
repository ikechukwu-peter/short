"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const mongoose_1 = require("mongoose");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "./.env" });
//initializing app
const app_1 = __importDefault(require("./app"));
const numWorkers = (0, os_1.cpus)().length;
if (cluster_1.default.isPrimary) {
    console.log("Master cluster setting up " + numWorkers + " workers...");
    for (let i = 0; i < numWorkers; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("online", function (worker) {
        console.log("Worker " + worker.process.pid + " is online");
    });
    cluster_1.default.on("exit", function (worker, code, signal) {
        console.log("Worker " +
            worker.process.pid +
            " died with code: " +
            code +
            ", and signal: " +
            signal);
        console.log("Starting a new worker");
        cluster_1.default.fork();
    });
}
else {
    //Handle uncaughtExceptions
    process.on("uncaughtException", (err) => {
        console.log("UNCAUGHT EXCEPTION! Server shutting down...");
        console.log(err.name, err.message, err.stack);
        process.exit(1);
    });
    //Connecting to mongoose
    function dbInit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, mongoose_1.connect)(process.env.DATABASE);
                console.log("Connected to Database successfully");
            }
            catch (err) {
                console.log("Failed to connect to database " + err);
            }
        });
    }
    //Call DB to start
    dbInit();
    //Setting port
    const port = process.env.PORT || 5000;
    //Listening for request
    const server = app_1.default.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
    process.on("unhandledRejection", (err) => {
        console.log("UNHANDLED REJECTION! 💥 Shutting down...");
        console.log(err);
        server.close(() => {
            process.exit(1);
        });
    });
    //For heroku
    process.on("SIGTERM", () => {
        console.log("SIGTERM RECEIVED. Shuttig down gracefully!!");
        server.close(() => {
            console.log("Process terminated!");
        });
    });
}
