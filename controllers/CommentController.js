import Comment from "../models/Comment";
import * as meta from "../utils/enum";
import * as msg from "../utils/message";

export async function listComment(req, res) {
    try {
        Comment.find({ is_active: true }).populate("user_id").exec(async (err, datas) => {
            if(err) {
                console.log("List Comment Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            datas = await Promise.all(datas.map(p => p.fillObject()));
            res.status(200).json({ meta: meta.normal.OK, data: datas });
        })
    }
    catch (err) {
        console.log("List Comment Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function getComment(req, res) {
    try {
        Comment.findById(req.params.id).populate("user_id").exec(async (err, data) => {
            if(err) {
                console.log("Comment Get Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message});
            }
        })
    }
    catch (err) {

    }
}

export function addComment(req, res) {
    try {

    }
    catch (err) {

    }
}

export function updateComment(req, res) {
    try {

    }
    catch (err) {

    }
}

export function deleteComment(req, res) {
    try {

    }
    catch (err) {

    }
}
