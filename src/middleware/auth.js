const jwt = require("jsonwebtoken");
const Company = require("../models/company");

async function auth(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretkey");
    const company = await Company.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!company) {
      throw new Error();
    }
    req.company = company;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authorization failed" });
  }
}

module.exports = auth;
