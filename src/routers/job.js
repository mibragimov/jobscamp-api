const express = require("express");
const Job = require("../models/job");
const router = new express.Router();

router.post("/jobs", async (req, res) => {
  const job = new Job(req.body);

  try {
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.send(jobs);
  } catch (error) {
    res.status(404).send();
  }
});

router.patch("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(job);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    res.send(job);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
