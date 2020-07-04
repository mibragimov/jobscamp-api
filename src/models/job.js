const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    company: {
      type: String,
      required: true,
    },
    logo: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Job = new mongoose.model("Job", jobSchema);

module.exports = Job;
