const User = require("../models/User");
const router = require("express").Router();
const { authorization, adminAuthorization } = require("./verifyToken");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

//修改USER資料
router.put("/:id", authorization, async (req, res) => {
  //如果body有傳入password，就進入這個if
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch {
    (e) => {
      res.status(500).json("出錯拉");
    };
  }
});
//刪除USER資料

router.delete("/id", adminAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("使用者刪除成功");
  } catch (e) {
    res.status(500).json("刪除失敗", e);
  }
});

//獲取單一使用者
router.get("/find/:id", adminAuthorization, async (req, res) => {
  try {
    const specificUser = await User.findById(req.params.id);
    const { password, ...others } = specificUser._doc;
    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
});
//獲取所有使用者
router.get("/findAll", adminAuthorization, async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
