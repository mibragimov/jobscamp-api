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
        skill: {
          type: String,
        },
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: String,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

const Job = new mongoose.model("Job", jobSchema);

module.exports = Job;
