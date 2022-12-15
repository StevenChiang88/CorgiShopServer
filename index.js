const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db連結成功");
  })
  .catch((err) => {
    console.log(err, "db連接失敗");
  });
const app = express();
app.use(cors());
//要先用中間件讓express讀懂json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//用中間件建立各個api路徑
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

app.listen(5000, () => {
  console.log("backend is runining");
});

module.exports = app;
