const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./routes/indexRouter.js");

app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.json());

app.use("/", router);

app.listen(PORT, () =>
  console.log(`Server läuft auf http://localhost:${PORT}`),
);
