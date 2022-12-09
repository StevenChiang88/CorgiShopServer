const router = require("express").Router();
const Cart = require("../models/Cart");
const { authorization, adminAuthorization } = require("./verifyToken");

//新增購物車，userID會用body傳入，所以不用設置params
router.post("/", authorization, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = newCart.save();
    res.status(200).json(savedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//獲取用戶購物車清單
router.get("/find/:userId", authorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//獲取所有購物車清單(forAdmin)

router.get("/",adminAuthorization, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (e) {
    res.status(500).json(e);
  }
});

//更新購物車

router.put("/modify/:userId", authorization, async (req, res) => {
  try {
    const modifiedCart = await Cart.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(modifiedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//刪除商品
router.delete("/delete/:userId", authorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.userId);
    res.status(200).json("刪除成功");
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
