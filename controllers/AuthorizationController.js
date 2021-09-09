import * as msg from "../utils/message";
import * as meta from "../utils/enum";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User";
import { hashPwd, validatePwd } from "../utils/permission";

export async function login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (user) {
            const checkPwd = await validatePwd(req.body.password, user.password);

            if(checkPwd) {
                jwt.sign({ id: user._id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email }, process.env.TOKEN, {expiresIn: '10d'}, (err, token) => {
                    if (err) {
                        console.log("Log in Try Error ", err.message);
                        return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                    }
                    res.status(200).json({ meta: meta.normal.OK, data: token });
                })
            }
            else {
                res.status(200).json({ meta: meta.error.INVALIDLOGIN, message: msg.error_msg.not_username_pwd });
            }
        }
        else {
            res.status(200).json({ meta: meta.error.INVALIDLOGIN, message: msg.error_msg.not_username_pwd });
        }

    }
    catch (err) {
        console.log("Login Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: msg.err.message });
    }
}

export async function register (req, res) {
    try {
        // const { password, ...}
        User(req.body).save()
            .then(() => {
                res.status(200).json({meta: meta.normal.OK, message: msg.record.record_added})
            })
            .catch(err => {
                console.log("register try error ", err.message);
                res.status(200).json({ meta: meta.error.ERROR, message: err.message })
            })

    }
    catch (err) {
        console.log("Register Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}