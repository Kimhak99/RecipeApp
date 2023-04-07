import User from "../models/User";
import * as meta from "../utils/enum";
import * as msg from "../utils/message";
import { hashPwd } from "../utils/permission";

export async function listUser(req, res) {
    try {
        const search = req.body;

        search.limit === undefined || search.limit === 0 ? search.limit = 0 : search.limit;
        search.keyword === undefined || search.keyword === null ? search.keyword = "" : search.keyword;

        const name = search.keyword.split(" ");

        if (search.keyword != "") {
            User.find({
                is_active: true,
                $or: [
                    { firstname: { $regex: search.keyword, $options: 'i' } },
                    { lastname: { $regex: search.keyword, $options: 'i' } },
                    { username: { $regex: search.keyword, $options: 'i' } },
                    {
                        $and: [
                            { lastname: { $regex: name[0], $options: 'i' } },
                            { firstname: { $regex: name[1], $options: 'i' } },
                        ]
                    }
                ]
            }).limit(search.limit).skip(0).exec((err, datas) => {
                if (err) {
                    console.log("User List Try Error ", err.message);
                    return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                }

                datas = datas.map(p => p.fillObject());

                res.status(200).json({ meta: meta.normal.OK, data: datas });
            })
        }
        else {
            User.find({ is_active: true }).limit(search.limit).skip(search.skip).exec((err, datas) => {
                if (err) {
                    console.log("User List Try Error ", err.message);
                    return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                }

                datas = datas.map(p => p.fillObject());

                res.status(200).json({ meta: meta.normal.OK, data: datas });
            })
        }
    }

    catch (err) {
        console.log("User List Error", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });

    }
};

export function getUser(req, res) {
    try {
        User.findById(req.params.id).exec((err, data) => {
            if (err) {
                console.log("User Get Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, data: data.fillObject() });
        })
    }
    catch (err) {
        console.log("User Get Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
};

export async function addUser(req, res) {
    try {
        // const fullname = req.body.lastname + " " + req.body.firstname;
        if (!req.body) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.user });
        const { password, ...temp } = req.body;
        const user = new User({ ...temp, password: await hashPwd(password) });
        user.save()
            .then(() => {
                res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_added });
            })
            .catch(err => {
                console.log("User Add Try Error ", err.message);
                res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            })
    }
    catch (err) {
        console.log("User Add Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        if (!req.body.id) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.id });

        User.findByIdAndUpdate(req.body.id, req.body).exec((err, data) => {
            if (err) {
                console.log("User Update Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            console.log(data);

            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_updated });
        })
    }
    catch (err) {
        console.log("User Update Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, messeage: err.message });
    }
}

export function deleteUser(req, res) {
    try {
        User.findByIdAndUpdate(req.params.id, { is_active: false }).exec((err, data) => {
            if (err) {
                console.log("User Delete Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }
            if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_deleted });
        });
    }
    catch (err) {
        console.log("User Delete Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export async function getUserInfo(req, res) {
    try {
        res.status(200).json({ user_info: await User.findById(req.user.id) });

    }
    catch (err) {
        res.status(500).json({ meta: meta.ERROR, message: err.message });
    }
};