import express from 'express';
import {DataBucket, S3} from './src/s3';
import * as dotenv from "dotenv";
const app = express();

dotenv.config();


let s3 = new S3();

app.get('/', (req, res) => {
    let data: DataBucket = {
        Bucket: req.query['Bucket']?.toString(),
        Key: req.query['Key']?.toString()
    }
    s3.get(data).then((response: any) => {
        res.attachment(data['Key']);
        res.send(response.Body);
    }).catch(
        (err) => {
            res.send(err);
        }
    )
})
app.delete('/', (req, res) => {
    let data: DataBucket = {
        Bucket: req.query['Bucket']?.toString(),
        Key: req.query['Key']?.toString()
    }

    s3.delete(data).then((response: any) => {
        res.status(200)
        res.send(JSON.stringify(data))
    }).catch((err) => {
        res.status(500)
        res.send(err)
    })
})

app.post('/', (req, res) => {
    let upload = s3.upload.single('media');

    upload(req,res, (err:any) => {
        if (err) {
	    console.log(err)
            res.send(err)
        } else {
            res.send("uploaded!")
        }
    })
    
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
