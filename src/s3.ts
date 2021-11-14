const AWS = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');

export interface DataBucket {
    Bucket: string | undefined;
    Body?: File;
    Key: string | undefined;
}

export class S3 {
    s3: typeof AWS
    upload: typeof multer

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY
        })
        this.s3 = new AWS.S3();
        this.upload = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: function (req: any, file: any, cb: any) {
                    cb(null, req.query['Bucket'])
                },
                key: function (req: any, file: any, cb: any) {
                    cb(null, req.query['Key']);
                }
            })
        });
    }
    get(request: DataBucket) {
        return new Promise((resolve, reject) => {
            this.s3.getObject(request, (err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })

    }
    delete(request: DataBucket) {
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(request, (err: any, data: any) => {
                if (err) { reject(err) }
                if (data) {
                    resolve(data)
                }
            })
        })
    }
    post(request: DataBucket) {
        return new Promise((resolve, reject) => {
            this.s3.upload(request, (err: any, data: any) => {
                if (err) {
                    reject(err)
                }
                if (data) {
                    resolve(data.Location)
                }
            })
        })
    }
    createBucket(bucket_name: string) {
        return new Promise((resolve, reject) => {
            this.s3.createBucket((bucket_name), (err: any, data: any) => {
                if (err) {
                    reject(err)
                }
                if (data) {
                    resolve(data.Location)
                }
            })
        })

    }
}