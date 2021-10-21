import Recipe from "../models/Recipe";
import Category from "../models/Category";
import * as meta from "../utils/enum";
import * as msg from "../utils/message";
export async function listRecipeV2(req, res) {
  try {
    const body = req.body;
    let filter = { is_active: true };
    let recipes;

    /**
    * all search must find by .keyword
    * 1. find category by name (select exact name, ex: "japan" = true, "jp" = false, true only if category name is "jp". "cate A", "cate B", user search -> "cate", both false)
    * 2. assign result to filter.category_id with id field from result
    * 3. prevent null or if error happened return from category.find()//
    * cate = Category.find()
    * if(!cat) return  res.status yes...
    */

    //type 0 - search bar, type 1 category list
    if (body.type == 0) {
      let category = await Category.findOne({ category_name: { $regex: body.keyword, $options: "i" } });

      if (category || body.keyword) filter = { ...filter, $or: [] };
      if (category) filter["$or"].push({ category_id: category._id });
      if (body.keyword) filter["$or"].push({ recipe_title: { $regex: body.keyword, $options: "i" } })

      if (body.user_id) {
        filter["$or"].push({ user_id: body.user_id });
      }
    }
    else if (body.type == 1) {
      if (body.category) filter.category_id = body.category;
    }

    //need more check
    // if(body.user) filter.recipe_title = { $regex: body.keyword, $options: "i" };

    recipes = await Recipe.find(filter)
      .limit(body.limit)
      .skip(0)
      .populate("category_id user_id");

    if (!recipes)
      return res
        .status(500)
        .send({ meta: 500, message: "internal server error" });

    recipes = await Promise.all(recipes.map((item) => item.fillObject()));

    //part of it is my bad. xd. i didnt use the meta thing, i used 200 directly, while
    // u check for 2001 lol... well, my bad...
    res.status(200).send({ meta: meta.normal.OK, datas: recipes });
  } catch (err) {
    console.log("Recipe List Error", err.message);
    res
      .status(500)
      .json({ meta: meta.internal_error.ERROR, message: err.message });
  }
}

//it's magic time, done yay :D
// export async function listRecipe(req, res) {
//   try {
//     const search = req.body;

//     search.limit === undefined || search.limit === 0
//       ? (search.limit = 0)
//       : search.limit;
//     search.keyword === undefined || search.keyword === null
//       ? (search.keyword = "")
//       : search.keyword;

//     if (search.keyword != "") {
//       Recipe.find({
//         is_active: true,
//         $or: [
//           { recipe_title: { $regex: search.keyword, $options: "i" } },
//           { category_id: { $regex: search.keyword, $options: "i" } },
//         ],
//       })
//         .populate("category_id")
//         .populate("user_id")
//         .limit(search.limit)
//         .skip(0)
//         .exec(async (err, datas) => {
//           if (err) {
//             console.log("Recipe List Try Error", err.message);
//             return res
//               .status(200)
//               .json({ meta: meta.error.ERROR, message: err.message });
//           }

//           datas = await Promise.all(datas.map((p) => p.fillObject()));
//           res.status(200).json({ meta: meta.normal.OK, datas: datas });
//         });
//     } else {
//       Recipe.find({ is_active: true })
//         .populate("category_id")
//         .populate("user_id")
//         .limit(search.limit)
//         .skip(search.skip)
//         .exec(async (err, datas) => {
//           if (err) {
//             console.log("Recipe List Try Error", err.message);
//             return res
//               .status(200)
//               .json({ meta: meta.error.ERROR, message: err.message });
//           }

//           datas = await Promise.all(datas.map((p) => p.fillObject()));
//           res.status(200).json({ meta: meta.normal.OK, datas: datas });
//         });
//     }
//   } catch (err) {
//     console.log("Recipe List Error", err.message);
//     res
//       .status(500)
//       .json({ meta: meta.internal_error.ERROR, message: err.message });
//   }
// }

export function getRecipe(req, res) {
  try {
    Recipe.findById(req.params.id).populate("category_id user_id")
      .exec(async (err, data) => {
        if (err) {
          console.log("Recipe Get Try Error", err.message);
          return res
            .status(200)
            .json({ meta: meta.error.ERROR, message: err.message });
        }

        if (!data) return res.status(200).json({ meta: meta.error.NOTEXIST, message: msg.record.record_notexist });

        res.status(200).json({ meta: meta.normal.OK, data: await data.fillObject() });
        // res.status(200).json({ meta: meta.normal.OK, data: {} });
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
        return res.status(200).json({
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
