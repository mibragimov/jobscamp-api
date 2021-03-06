const express = require("express");
const Job = require("../models/job");
const auth = require("../middleware/auth");
const router = new express.Router();

// Create new job
router.post("/jobs", auth, async (req, res) => {
  const job = new Job({
    ...req.body,
    owner: req.company._id,
    company: req.company.name,
  });

  try {
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET all created by the company jobs
// query = limit ===> integer, 5,10,20
// query = skip ===> integer, 1,2,3
// query = sortBy ====> string exp 'createdAt:desc' or 'createdAt_asc'
router.get("/jobs/me", auth, async (req, res) => {
  const { role, skills, company, sortBy } = req.query;
  const sort = {};
  const match = {};
  //const match = {};

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  if (role) {
    match.role = { $regex: role, $options: "i" };
  }
  if (skills) {
    match.skills = { $regex: skills, $options: "i" };
  }
  if (company) {
    match.company = { $regex: company, $options: "i" };
  }

  try {
    // const jobs = await Job.find({});
    await req.company
      .populate({
        path: "jobs",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.send(req.company.jobs);
  } catch (error) {
    res.status(404).send();
  }
});

// GET all jobs

router.get("/jobs", async (req, res) => {
  const { role, skills, company, sortBy } = req.query;
  const queryObj = {};
  const sortObj = {};
  if (role) {
    queryObj.role = { $regex: role, $options: "i" };
  }
  if (skills) {
    queryObj.skills = { $regex: skills, $options: "i" };
  }
  if (company) {
    queryObj.company = { $regex: company, $options: "i" };
  }

  if (sortBy) {
    const parts = sortBy.split(":");
    sortObj[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    const jobs = await Job.find(queryObj).sort(sortObj);
    res.send(jobs);
  } catch (error) {
    res.status(404).send();
  }
});

// Update job
router.patch("/jobs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "role",
    "type",
    "skills",
    "location",
    "new",
    "featured",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(404).send({ error: "Invalid update" });
  }
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      owner: req.company._id,
    });

    if (!job) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      job[update] = req.body[update];
    });
    // const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    await job.save();
    res.send(job);
  } catch (error) {
    res.status(400).send();
  }
});

// DELETE job
router.delete("/jobs/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      owner: req.company._id,
    });
    if (!job) {
      return res.status(404).send();
    }
    res.send(job);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
