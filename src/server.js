const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./routes/indexRouter.js");
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

app.use(express.json());

app.use("/", router);

app.listen(PORT, () =>
  console.log(`Server läuft auf http://localhost:${PORT}`),
);
