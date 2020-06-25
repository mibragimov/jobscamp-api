const request = require("supertest");
const app = require("../src/app");
const Job = require("../src/models/job");
const {
  company,
  companyID,
  companyTwo,
  companyIDTwo,
  job,
  jobID,
  jobTwo,
  jobIDTwo,
  jobThree,
  jobIDThree,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create a new job", async () => {
  const response = await request(app)
    .post("/jobs")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send({
      role: "backend developer",
      type: "full-time",
      location: "remote",
    })
    .expect(201);

  const job = Job.findById(response.body._id);
  expect(job).not.toBeNull();
});

test("should get all jobs company jobs", async () => {
  const response = await request(app)
    .get("/jobs/me")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("should not delete other company jobs", async () => {
  await request(app)
    .delete(`/jobs/${jobID}`)
    .set("Authorization", `Bearer ${companyTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const job = await Job.findById(jobID);
  expect(job).not.toBeNull();
});

test("should not create job without required field", async () => {
  await request(app)
    .post("/jobs")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send({
      role: "test",
      test: "this is invalid",
    })
    .expect(400);
});

test("should not update job with invalid field", async () => {
  await request(app)
    .patch(`/patch/${jobIDTwo}`)
    .set("Authorization", `Bearer ${companyTwo.tokens[0].token}`)
    .send({
      role: "updated",
      test: "failed",
    })
    .expect(404);
});

test("should not update other companies jobs", async () => {
  await request(app)
    .patch(`/jobs/${jobID}`)
    .set("Authorization", `Bearer ${companyTwo.tokens[0].token}`)
    .send({
      role: "new role",
    })
    .expect(404);
});

test("should delete company job", async () => {
  await request(app)
    .delete(`/jobs/${jobID}`)
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not delete job if unauthenticated", async () => {
  await request(app).delete(`/jobs/${jobID}`).send().expect(401);
});
