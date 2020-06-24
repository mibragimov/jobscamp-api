const express = require("express");
const Company = require("../models/company");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");

const upload = multer({
  // file destination
  //   dest: "images",
  limits: {
    // max file size in bytes, 1mb
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
      return cb(new Error("Please, upload .jpg, .jpeg, .svg or .png file!"));
    }
    // cb accepts 2 args, 1st err to reject, 2nd true to accept
    cb(undefined, true);
  },
});

// Create new company
router.post("/companies", async (req, res) => {
  const company = new Company(req.body);
  try {
    await company.save();
    const token = await company.generateAuthToken();
    res.status(201).send({ company, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login using credentials
router.post("/companies/login", async (req, res) => {
  try {
    const company = await Company.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await company.generateAuthToken();
    res.status(202).send({ company, token });
  } catch (error) {
    res.status(401).send();
  }
});

// Logout company
router.post("/companies/logout", auth, async (req, res) => {
  try {
    req.company.tokens = req.company.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.company.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// Logout all devices
router.post("/companies/logoutAll", auth, async (req, res) => {
  try {
    req.company.tokens = [];
    await req.company.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// Upload company logo
router.post("/companies/:id/logo", upload.single("logo"), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  try {
    const company = await Company.findById(req.params.id);
    company.logo = buffer;
    await company.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});
// Generate company logo url
router.get("/companies/:id/logo", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company || !company.logo) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(company.logo);
  } catch (error) {
    res.status(404).send();
  }
});
// GET all registered companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.send(companies);
  } catch (error) {
    res.status(404).send();
  }
});
// DELETE company
router.delete("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    res.send(company);
  } catch (error) {
    res.status(400).send(error);
  }
});
// EDIT company
router.patch("/companies/:id", async (req, res) => {
  // const updates = Object.keys(req.body);
  // const allowedUpdates = ['name', 'email', 'password'];
  // const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

  // if (!isValidUpdate) {
  //     return res.status(404).send({ error: 'Invalid update' })
  // }
  try {
    //    updates.forEach(update => {
    //        req.user[update] = req.body[update]
    //    })
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(company);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
