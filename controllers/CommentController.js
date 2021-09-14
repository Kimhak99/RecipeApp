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
            if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, data: await data.fillObject() });
        })
    }
    catch (err) {
        console.log("Comment Get Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function addComment(req, res) {
    try {
        if(!req.body) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.comment});
        Comment(req.body).save()
            .then(() => {
                res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_added });
            })
            .catch((err) => {
                console.log("Comment Add Try Error ", err.message);
                res.status(200).json({ meta: meta.error.ERROR, message: err.message});
            })
    }
    catch (err) {
        console.log("Comment Add Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function updateComment(req, res) {
    try {
        if(!req.body.id) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.id});
        Comment.findByIdAndUpdate(req.body.id, req.body).exec((err, data) => {
            if(err){
                console.log("Comment Update Try Error", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }
            
            if(!data) res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_updated });
        })
    }
    catch (err) {
        console.log("Comment Update Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.msg });
    }
}

export function deleteComment(req, res) {
    try {
        Comment.findByIdAndUpdate(req.params.id, { is_active: false }).exec((err, data) => {
            if(err) {
                console.log("Comment Delete Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if(!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_deleted });
        })

    }
    catch (err) {
        console.log("Comment Delete Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}
