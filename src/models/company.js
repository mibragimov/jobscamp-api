const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password can not contain "password"');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    logo: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.statics.findByCredentials = async function (email, password) {
  const company = await Company.findOne({ email });

  if (!company) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, company.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return company;
};

companySchema.methods.generateAuthToken = async function () {
  const company = this;

  const token = jwt.sign({ _id: company._id }, "secretkey");
  company.tokens = company.tokens.concat({ token });
  await company.save();

  return token;
};

companySchema.pre("save", async function (next) {
  const company = this;

  if (company.isModified("password")) {
    company.password = await bcrypt.hash(company.password, 8);
  }

  next();
});

const Company = new mongoose.model("Company", companySchema);

module.exports = Company;
