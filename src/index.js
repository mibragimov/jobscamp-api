const path = require("path");
const express = require("express");
const app = express();
require("./db/mongoose");

// routes
const companyRoutes = require("./routers/company");
const jobRoutes = require("./routers/job");

const port = process.env.PORT;
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(companyRoutes);
app.use(jobRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
