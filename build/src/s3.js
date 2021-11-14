"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
const AWS = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');
class S3 {
    constructor() {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY
        });
        this.s3 = new AWS.S3();
        this.upload = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: function (req, file, cb) {
                    cb(null, req.query['Bucket']);
                },
                key: function (req, file, cb) {
                    cb(null, req.query['Key']);
                }
            })
        });
    }
    get(request) {
        return new Promise((resolve, reject) => {
            this.s3.getObject(request, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    delete(request) {
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(request, (err, data) => {
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
    post(request) {
        return new Promise((resolve, reject) => {
            this.s3.upload(request, (err, data) => {
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data.Location);
                }
            });
        });
    }
    createBucket(bucket_name) {
        return new Promise((resolve, reject) => {
            this.s3.createBucket((bucket_name), (err, data) => {
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data.Location);
                }
            });
        });
    }
}
exports.S3 = S3;
