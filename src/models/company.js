const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Job = require("../models/job");

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

// 'virtual' allows to setup virtual attributes, we not changing what we store for user document
// it is a way for mongoose to figure out how these two things are related
// 2 args: 1st the name for the virtual field, any name
// 2nd is object to configure induvidual fields
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "owner",
});
// 'statics' sets up a method on Company schema(not an instance created by itself), it gets called in routers
// it gets called in company login route
companySchema.statics.findByCredentials = async function (email, password) {
  const company = await Company.findOne({ email });

  if (!company) {
    throw new Error("Unable to login");
  }
  /* if user then compare user password in database to the password user provided
	// bcrypt compare method compares 2 args, 1st value coming from req, 2nd value in database
	// it returns boolean 
	*/
  const isMatch = await bcrypt.compare(password, company.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return company;
};
// generate auth token when company created or logged in
companySchema.methods.generateAuthToken = async function () {
  const company = this;

  const token = jwt.sign({ _id: company._id }, "secretkey");
  company.tokens = company.tokens.concat({ token });
  await company.save();

  return token;
};

/* create toJSON method that gets called every time user sends request 
// you dont need to call this method explicitly, its gets called by express automatically
*/
companySchema.methods.toJSON = function () {
  const company = this;
  const companyObj = company.toObject();
  // delete properties you dont want to expose to user
  delete companyObj.password;
  delete companyObj.tokens;
  delete companyObj.logo;

  return companyObj;
};

// hash password when company is created
companySchema.pre("save", async function (next) {
  const company = this;

  if (company.isModified("password")) {
    company.password = await bcrypt.hash(company.password, 8);
  }

  next();
});

// Remove all jobs created by the company, when comapany is deleted
companySchema.pre("remove", async function (next) {
  const company = this;

  await Job.deleteMany({ owner: company._id });
  next();
});

const Company = new mongoose.model("Company", companySchema);

module.exports = Company;
