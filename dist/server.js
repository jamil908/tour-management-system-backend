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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://tour:asdfR12@cluster0.uqwcx.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0");
        console.log('connected to db');
        server = app_1.default.listen(5000, () => {
            console.log("server is listening on 5000 port");
        });
    }
    catch (error) { }
});
startServer();
process.on("SIGTERM", () => {
    console.log("🔥SIGTERM SIGNAL RICEVED detected, shutting down...");
    if (server) {
        server.close(() => {
            console.log("🚪 Server closed.");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("SIGINT", () => {
    console.log("🔥SIGINT SIGNAL RICEVED detected, shutting down...");
    if (server) {
        server.close(() => {
            console.log("🚪 Server closed.");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("unhandledRejection", (error) => {
    console.log("🔥 Unhandled Rejection detected, shutting down...");
    console.error((error === null || error === void 0 ? void 0 : error.message) || error);
    if (server) {
        server.close(() => {
            console.log("🚪 Server closed.");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", (error) => {
    console.log("🔥Uncaught Exception detected, shutting down...");
    console.error((error === null || error === void 0 ? void 0 : error.message) || error);
    if (server) {
        server.close(() => {
            console.log("🚪 Server closed.");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
throw new Error(' i forgot to catch this local error');
