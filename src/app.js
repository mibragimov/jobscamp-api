const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/mongoose");

// routes
const companyRoutes = require("./routers/company");
const jobRoutes = require("./routers/job");

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.get("/", (req, res) => {
  res.send();
});
app.use(express.json());
app.use(companyRoutes);
app.use(jobRoutes);

module.exports = app;
