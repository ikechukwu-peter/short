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
class Random {
    constructor() { }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let strLength = 5;
            let str = "";
            let possibleCharacters = "abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (let i = 0; i < strLength; i++) {
                // Get a random character from the possible character string
                let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                // Append this character to the string
                str += randomCharacter;
            }
            // Return the final string
            return str;
        });
    }
}
let random = new Random();
process.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received the message ${msg} from parent`);
    let uniqueUrl = yield random.generate();
    if (typeof process.send === "function") {
        process.send(uniqueUrl);
    }
}));
