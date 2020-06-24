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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

const Job = new mongoose.model("Job", jobSchema);

module.exports = Job;
