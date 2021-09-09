import jwt from "jsonwebtoken";
import * as meta from "./enum";
import * as msg from "./message";
import "dotenv/config";
import bcrypt from "bcrypt";

export function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== "undefined") {
        jwt.verify(bearerHeader, process.env.TOKEN, function (err, decoded) {
            if(err) {
                console.log("Authorization Try Error", err.message);
                return res.status(200).send({ meta: meta.error.TOKENEXPIRE, message: msg.error_msg.token_expired });
            }

            req.user = decoded.data;

            next();
        });
    }
    else {
        res.status(403).send({ meta: meta.error.UNAUTHORIZED, message: msg.error_msg.token_required });
    }
}

export async function hashPwd(pwd) {
    return await bcrypt.hash(pwd, await bcrypt.genSalt(10));
}

export function validatePwd(pwd, dbPwd) {
    // return bcrypt.compare(pwd, dbPwd);
    if(pwd === dbPwd) {
        return true;
    }else {
        return false;
    }
}