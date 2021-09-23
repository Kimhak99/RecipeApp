import Category from "../models/Category";
import * as msg from "../utils/message";
import * as meta from "../utils/enum";

export function listCategory(req, res) {
    try {
        const search = req.body;

        search.limit === undefined || search.limit === 0 ? search.limit = 0 : search.limit;
        search.keyword === undefined || search.keyword === null? search.keyword = "" : search.keyword;

        if(search.keyword != "") {
            Category.find({
                is_active: true,
                $where: [
                    {category_name: {$regex: search.keyword, $options: 'i'}}
                ]
            }).limit(search.limit).skip(0).exec((err, datas) => {
                if(err) {
                    console.log("List Category Try Error ", err.message);
                    return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                }
    
                datas = datas.map(p => p.fillObject());
                res.status(200).json({ meta: meta.normal.OK, data: datas });
            })
        }
        else {
            Category.find({ is_active: true }).exec((err, datas) => {
                if(err) {
                    console.log("List Category Try Error ", err.message);
                    return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
                }
    
                datas = datas.map(p => p.fillObject());
                res.status(200).json({ meta: meta.normal.OK, data: datas });
            })
        }      
    }
    catch(err) {
        console.log("Category List Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function getCategory(req, res) {
    try {
        Category.findById(req.params.id).exec((err, data) => {
            if(err) {
                console.log("Category Get Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if(!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, data: data.fillObject() });
        })
    }
    catch(err) {
        console.log("Category Get Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function addCategory(req, res) {
    try {
        if(!req.body) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.category });
        Category(req.body).save()
            .then(() => {
                res.status(200).json({ meta: meta.normal.OK, message: msg. record.record_added });
            })
            .catch (err => {
                console.log("Category Add Try Error ", err.message);
                res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            })
    }
    catch(err) {
        console.log("Category Add Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function updateCategory(req, res) {
    try {
        if(!req.body.id) return res.status(200).json({ meta: meta.error.MISSING, message: msg.missing_data.id });
        Category.findByIdAndUpdate(req.body.id, req.body).exec((err, data) => {
            if(err) {
                console.log("Category Update Try Error ", err.message);
                return res.status.json({ meta: meta.error.ERROR, message: err.message });
            }
            if(!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_updated });
        })
    }
    catch(err) {
        console.log("Category Update Err ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}

export function deleteCategory(req, res) {
    try {
        Category.findByIdAndUpdate(req.params.id, { is_active: false }).exec((err, data) => {
            if(err) {
                console.log("Category Delete Try Error ", err.message);
                return res.status(200).json({ meta: meta.error.ERROR, message: err.message });
            }

            if(!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });
            res.status(200).json({ meta: meta.normal.OK, message: msg.record.record_deleted });
        });
    }
    catch(err) {
        console.log("Category Delete Error ", err.message);
        res.status(500).json({ meta: meta.internal_error.ERROR, message: err.message });
    }
}