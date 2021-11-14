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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const s3_1 = require("./src/s3");
const dotenv = __importStar(require("dotenv"));
const app = (0, express_1.default)();
dotenv.config();
let s3 = new s3_1.S3();
app.get('/', (req, res) => {
    var _a, _b;
    let data = {
        Bucket: (_a = req.query['Bucket']) === null || _a === void 0 ? void 0 : _a.toString(),
        Key: (_b = req.query['Key']) === null || _b === void 0 ? void 0 : _b.toString()
    };
    s3.get(data).then((response) => {
        res.attachment(data['Key']);
        res.send(response.Body);
    }).catch((err) => {
        res.send(err);
    });
});
app.delete('/', (req, res) => {
    var _a, _b;
    let data = {
        Bucket: (_a = req.query['Bucket']) === null || _a === void 0 ? void 0 : _a.toString(),
        Key: (_b = req.query['Key']) === null || _b === void 0 ? void 0 : _b.toString()
    };
    s3.delete(data).then((response) => {
        res.status(200);
        res.send(JSON.stringify(data));
    }).catch((err) => {
        res.status(500);
        res.send(err);
    });
});
app.post('/', (req, res) => {
    let upload = s3.upload.single('media');
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send("uploaded!");
        }
    });
});
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
