const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Company = require("../../src/models/company");
const Job = require("../../src/models/job");

// Create a test company object
const companyID = new mongoose.Types.ObjectId();
const company = {
  _id: companyID,
  name: "example",
  email: "comp@example.com",
  password: "comppass123!!",
  tokens: [
    {
      token: jwt.sign({ _id: companyID }, process.env.JWT_SECRET),
    },
  ],
};

const companyIDTwo = new mongoose.Types.ObjectId();
const companyTwo = {
  _id: companyIDTwo,
  name: "example two",
  email: "compTwo@example.com",
  password: "comppassTwo123!!",
  tokens: [
    {
      token: jwt.sign({ _id: companyIDTwo }, process.env.JWT_SECRET),
    },
  ],
};

const jobID = new mongoose.Types.ObjectId();

const job = {
  _id: jobID,
  role: "job one",
  type: "full-time",
  location: "remote",
  owner: company._id,
};

const jobIDTwo = new mongoose.Types.ObjectId();

const jobTwo = {
  _id: jobIDTwo,
  role: "job two",
  type: "full-time",
  location: "remote",
  owner: company._id,
};

const jobIDThree = new mongoose.Types.ObjectId();

const jobThree = {
  _id: jobIDThree,
  role: "job three",
  type: "full-time",
  location: "remote",
  owner: companyTwo._id,
};
// Remove all data from test database and create a company for testing
async function setupDatabase() {
  await Company.deleteMany();
  await Job.deleteMany();
  await new Company(company).save();
  await new Company(companyTwo).save();
  await new Job(job).save();
  await new Job(jobTwo).save();
  await new Job(jobThree).save();
}

module.exports = {
  company,
  companyID,
  companyTwo,
  companyIDTwo,
  setupDatabase,
  job,
  jobID,
  jobIDTwo,
  jobTwo,
  jobThree,
  jobIDThree,
};
