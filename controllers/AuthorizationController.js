import * as msg from "../utils/message";
import * as meta from "../utils/enum";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User";
import { hashPwd, validatePwd } from "../utils/permission";

export async function login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username, is_active: true });

        if (user) {
            const checkPwd = await validatePwd(req.body.password, user.password);

            if (checkPwd) {
                //u have whoever request their own info embeded inside token already, so no need to send anymore just reuse it
                //u didnt put any role, should I?u can just pass id and then find  by id to get whatevr info u need ok
                jwt.sign({ id: user._id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email }, process.env.TOKEN, { expiresIn: '10d' }, (err, token) => {
                    if (err) {
                        console.log("Log in Try Error ", err);
                        return res.status(200).json({ meta: meta.error.ERROR, message: err });
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
        console.log("Login Error ", err);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err });
    }
}

export async function register(req, res) {
    try {
        const { password, ...temp } = req.body;

        const user = new User({ ...temp, password: await hashPwd(password) });
        user.save()
            .then(data => {
                res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_added })
            })
            .catch(err => {
                console.log("register Try Error ", err.message);
                res.status(200).json({ meta: meta.error.ERROR, message: err.message })
            })

    }
    catch (err) {
        console.log("Register Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}
export async function resetPassword(req, res) {
    try {
        const user = await User.findById(req.user.id)
        if(!user) {
            return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
        }
        const checkPwd = await validatePwd(req.body.current_password, user.password);
        if(checkPwd) {
            await User.findByIdAndUpdate(req.user.id, { password: await hashPwd(req.body.new_password)}, {
                returnOriginal: false
              }).exec((err, data) => {
                if (err) {
                    console.log("Reset Password Try Error ", err.message)
                    return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                }
    
                if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
    
                res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_updated });
            });
        }
        

        // var user = User.findOne({ password: req.body.password });

        // if (user) {
        //     user.password = await hashPwd(req.body.new_password);
        //     user.save();
        // }
        // else {
        //     res.send("invalid password");
        // }

    }
    catch (err) {
        console.log("Reset Password Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export async function forgetPassword(req, res) {
    try {
       
        var user = await User.findOne({ email: req.body.email });

        if(!user) {
            return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
        }

        await User.findByIdAndUpdate(user.id, { password: await hashPwd(req.body.new_password)}, {
            returnOriginal: false
          }).exec((err, data) => {
            if (err) {
                console.log("Forget Password Try Error ", err.message)
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_updated });
        });
     
        
    }
    catch (err) {
        console.log("Forget Password Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}
