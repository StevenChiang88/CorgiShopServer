//用來認證使用者權限，放在第二個參數
// router.put("/:id", authorization, async (req, res) => {}

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("token權限過期或錯誤token");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("您沒有Token權限");
  }
};
const authorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params._id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("您沒有權限修改會員資料");
    }
  });
};

const adminAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("只有管理員可以進行操作");
    }
  });
};

module.exports = { verifyToken, authorization, adminAuthorization };
