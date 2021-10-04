import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import "dotenv/config";
import serverConfig from "./serverConfig.js";

function checkFileType(data) {
    const fileType = ["image/jpeg", "image/png"];

    if (Array.isArray(data)) {
        const temp = data.filter(p => !fileType.includes(p.type));

        return temp.length == 0 ? false : true;
    }
    else {
        return !fileType.includes(data.mimetype);
    }
};

const connection = mongoose.createConnection(serverConfig.db_connection, {});
export const collectionName = "files";
export let gfs;
export let gridFSBucket;

connection.on("open", () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection(collectionName);
    gridFSBucket = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: collectionName });
});

const storage = new GridFsStorage({
    url: serverConfig.db_connection,
    options: { useUnifiedTopology: true },
    file: (_, file) => {
        return new Promise((resolve, __) => {
            if (checkFileType(file)) throw new ApiError(httpStatus.BAD_REQUEST, "Wrong file type(s)");

            crypto.randomBytes(16, (err, buf) => {
                if (err) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    metadata: { originalname: file.originalname },
                    filename: filename,
                    bucketName: collectionName,
                };

                return resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

export default upload;