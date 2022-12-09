const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
//註冊
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (e) {
    res.status(500).json(e);
  }
});

// 登入
router.post("/login", async (req, res) => {
  try {
    //把輸入的帳密從req.body取出，進mongoDB FindOne
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("帳號錯誤");
    //再把從DB中拿出來的user物件的密碼解密
    const passwordFromDB = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    console.log(passwordFromDB, "DB拿出來，已解碼尚未encUTF8"); //{ words: [ 1952805748, 825373449, 151587081, 151587081 ], sigBytes: 7 } DB拿出來，已解碼尚未encUTF8
    const passwordToUft8 = passwordFromDB.toString(CryptoJS.enc.Utf8);
    passwordToUft8 !== req.body.password && res.status(401).json("密碼錯誤");
    //把DB拿出來的資料換成JWT
    const accessToken = JWT.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    //如果都正確，因為返回user會把密碼也返回，所以要把密碼去掉
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch {
    (e) => {
      res.status(500).json(e);
    };
  }
});

module.exports = router;
