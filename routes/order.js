const router = require("express").Router();
const Order = require("../models/Order");
const { authorization, adminAuthorization } = require("./verifyToken");

//新增訂單 測試ok
router.post("/", authorization, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});

//獲取用戶訂單
router.get("/find/:userId", authorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (e) {
    res.status(500).json(e);
  }
});

//獲取所有訂單(forAdmin)

router.get("/", adminAuthorization, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

//更新訂單

router.put("/modify/:userId", adminAuthorization, async (req, res) => {
  try {
    const modifiedOrder = await Order.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(modifiedOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});

//刪除
router.delete("/delete/:userId", adminAuthorization, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.userId);
    res.status(200).json("刪除成功");
  } catch (e) {
    res.status(500).json(e);
  }
});

// 拿到當月及前一個月收益，給後台charts使用
router.get("/revenue", adminAuthorization, async (req, res) => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  // const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  // const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  // const firstDayOfThisMonth = new Date(y, m - 1, 1);
  const firstDayOfLastYear = new Date(y - 1, 0);
  const firstDayOfThisYear = new Date(y, 0);
  const firstDayOfNextYear = new Date(y + 1, 0);

  try {
    const revenueOfLastYear = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfLastYear, $lte: firstDayOfThisYear },
        },
      },
      //total是Schema定義的
      { $project: { month: { $month: "$createdAt" }, sales: "$total" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    const revenueOfThisYear = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfThisYear, $lte: firstDayOfNextYear },
        },
      },
      //total是Schema定義的
      { $project: { month: { $month: "$createdAt" }, sales: "$total" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);

    res.status(200).json({ revenueOfThisYear, revenueOfLastYear });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
