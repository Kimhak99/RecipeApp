import User from "../models/User";
import * as meta from "../utils/enum";
import * as msg from "../utils/message";

export function listUser(req, res) {
    try {
        User.find({ is_active: true }).exec(async (err, datas) => {
            if(err) {
                console.log("User List Try Error", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            datas = datas.map(p => p.fillObject());

            res.status(200).json({ meta: meta.normal.OK, data: datas });
        })
    }
    catch (err) {

    }
}

export function getUser(req, res) {
    try {

    }
    catch (err) {

    }
}

export async function addUser(req, res) {
    try {

    }
    catch (err) {

    }
}

export async function updateUser(req, res) {
    try {

    }
    catch (err) {

    }
}

export async function deleteUser(req, res) {
    try {

    }
    catch (err) {

    }
}