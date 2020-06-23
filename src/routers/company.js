const express = require("express");
const Company = require("../models/company");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");

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

router.post("/companies", async (req, res) => {
  const company = new Company(req.body);
  try {
    await company.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

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

router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.send(companies);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    res.send(company);
  } catch (error) {
    res.status(400).send(error);
  }
});

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
