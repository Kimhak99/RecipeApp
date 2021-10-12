import Recipe from "../models/Recipe";
import Category from "../models/Category";
import * as meta from "../utils/enum";
import * as msg from "../utils/message";

export async function listRecipe(req, res) {
  try {
    const search = req.body;

    search.limit === undefined || search.limit === 0
      ? (search.limit = 0)
      : search.limit;
    search.keyword === undefined || search.keyword === null
      ? (search.keyword = "")
      : search.keyword;

    if (search.keyword != "") {
      Recipe.find({
        is_active: true,
        $or: [
          { recipe_title: { $regex: search.keyword, $options: "i" } },
          { category_id: { $regex: search.keyword, $options: "i" } },
        ],
      })
        .populate("category_id")
        .populate("user_id")
        .limit(search.limit)
        .skip(0)
        .exec(async (err, datas) => {
          if (err) {
            console.log("Recipe List Try Error", err.message);
            return res
              .status(200)
              .json({ meta: meta.error.ERROR, message: err.message });
          }

          datas = await Promise.all(datas.map((p) => p.fillObject()));
          res.status(200).json({ meta: meta.normal.OK, datas: datas });
        });
    } else {
      Recipe.find({ is_active: true })
        .populate("category_id")
        .populate("user_id")
        .exec(async (err, datas) => {
          if (err) {
            console.log("Recipe List Try Error", err.message);
            return res
              .status(200)
              .json({ meta: meta.error.ERROR, message: err.message });
          }

          datas = await Promise.all(datas.map((p) => p.fillObject()));
          res.status(200).json({ meta: meta.normal.OK, datas: datas });
        });
    }
  } catch (err) {
    console.log("Recipe List Error", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}

export async function listRecipeCategory(req, res) {
  try {
    const category = await Category.findById(req.params.category_id);

    Recipe.find({ is_active: true, category_id: category._id })
      .populate("category_id")
      .populate("user_id")
      .exec(async (err, datas) => {
        if (err) {
          console.log("Recipe Category List Try Error", err.message);
          return res
            .status(200)
            .json({ meta: meta.error.ERROR, message: err.message });
        }

        datas = await Promise.all(datas.map((p) => p.fillObject()));
        res.status(200).json({ meta: meta.normal.OK, datas: datas });
      });
  } catch (err) {
    console.log("Recipe Category List Error", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}

export function getRecipe(req, res) {
  try {
    Recipe.findById(req.params.id).exec(async (err, data) => {
      if (err) {
        console.log("Recipe Get Try Error", err.message);
        return res
          .status(200)
          .json({ meta: meta.error.ERROR, message: err.message });
      }

      if (!data)
        return res
          .status(200)
          .json({
            meta: meta.error.NOTEXIST,
            message: msg.record.record_notexist,
          });

      res
        .status(200)
        .json({ meta: meta.normal.OK, data: await data.fillObject() });
    });
  } catch (err) {
    console.log("Recipe Get Error", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}

export function addRecipe(req, res) {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ meta: meta.error.MISSING, message: msg.missing_data.recipe });

    Recipe(req.body)
      .save()
      .then(() => {
        res
          .status(200)
          .json({ meta: meta.normal.OK, message: msg.record.record_added });
      })
      .catch((err) => {
        console.log("Recipe Add Try Error ", err.message);
        res.status(200).json({ meta: meta.error.ERROR, message: err.message });
      });
  } catch (err) {
    console.log("Recipe Add Error ", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}

export function updateRecipe(req, res) {
  try {
    if (!req.body.id)
      return res
        .status(200)
        .json({ meta: meta.error.MISSING, message: msg.missing_data.id });
    Recipe.findByIdAndUpdate(req.body.id, req.body).exec((err, data) => {
      if (err) {
        console.log("Recipe Update Try Error", err.message);
        return res
          .status(200)
          .json({ meta: meta.error.ERROR, message: err.message });
      }

      if (!data)
        return res
          .status(200)
          .json({
            meta: meta.error.NOTEXIST,
            message: msg.record.record_notexist,
          });
      res
        .status(200)
        .json({ meta: meta.normal.OK, message: msg.record.record_updated });
    });
  } catch (err) {
    console.log("Recipe Update Error ", err.message);
    res.status(500).json({ meta: meta.internal_error.ERROR, message: err.msg });
  }
}

export function deleteRecipe(req, res) {
  try {
    Recipe.findByIdAndUpdate(req.params.id, { is_active: false }).exec(
      (err, data) => {
        if (err) {
          console.log("Recipe Delete Try Error ", err.message);
          return res
            .status(200)
            .json({ meta: meta.error.ERROR, message: err.message });
        }

        if (!data)
          return res
            .status(200)
            .json({ meta: meta.error.ERROR, message: err.message });

        res
          .status(200)
          .json({ meta: meta.normal.OK, message: msg.record.record_deleted });
      }
    );
  } catch (err) {
    console.log("Recipe Delete Error ", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}
