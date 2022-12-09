const router = require("express").Router();
const Product = require("../models/Product");
const { adminAuthorization } = require("./verifyToken");

//獲取單一商品
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});
// http://localhost:5000/product?categories=xxxxxx
//獲取所有商品或特定種類商品
router.get("/", async (req, res) => {
  const qCategories = req.query.categories;
  try {
    let product;
    if (qCategories) {
      product = await Product.find({ categories: { $in: [qCategories] } });
    } else {
      product = await Product.find();
    }
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});

//創建商品
router.post("/add", adminAuthorization, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const addedProduct = await newProduct.save();
    res.status(200).json(addedProduct);
  } catch (e) {
    res.status(400).json(e);
  }
});

//更新商品

router.put("/modify/:id", adminAuthorization, async (req, res) => {
  try {
    const modifiedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(modifiedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//刪除商品
router.delete("/delete/:id", adminAuthorization, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("刪除成功");
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
