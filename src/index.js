const express = require("express");
const app = express();
require("./db/mongoose");
const companyRoutes = require("./routers/company");

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(companyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
