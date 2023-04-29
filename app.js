const express = require("express");
const app = express();

// 設定路由
app.get("/", function (req, res) {
  res.send("Hello World!!!!!");
});

// 啟動伺服器
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
