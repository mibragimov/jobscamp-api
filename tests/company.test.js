const request = require("supertest");
const app = require("../src/app");
const Company = require("../src/models/company");
const { company, companyID, setupDatabase } = require("../tests/fixtures/db");

// Remove all data from test database and create a company for testing
beforeEach(setupDatabase);

test("should create a new company", async () => {
  const response = await request(app)
    .post("/companies")
    .send({
      name: "jobscamp",
      email: "jobscamp@example.com",
      password: "mypass123!!",
    })
    .expect(201);

  // test if data is stored correctly in database
  expect(response.body.company.name).toBe("jobscamp");
});

test("should login existing company", async () => {
  const response = await request(app)
    .post("/companies/login")
    .send({
      email: company.email,
      password: company.password,
    })
    .expect(200);

  // test if token is different
  expect(response.token).not.toBe(company.tokens[0].token);
});

test("should not login nonexistent company", async () => {
  await request(app)
    .post("/companies/login")
    .send({
      email: "nonexist@example.com",
      password: "test1234!!!",
    })
    .expect(400);
});

test("should get company profile", async () => {
  await request(app)
    .get("/companies")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get company profile for unauthenticated users", async () => {
  await request(app).get("/companies").send().expect(401);
});

test("should delete a company profile", async () => {
  await request(app)
    .delete("/companies/me")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should validate if company is removed", async () => {
  await request(app)
    .delete("/companies/me")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);

  const comp = await Company.findById(companyID);
  expect(comp).toBeNull();
});

test("should not delete a profile for unauthenticated users", async () => {
  await request(app).delete("/companies/me").send().expect(401);
});

test("should upload company logo", async () => {
  await request(app)
    .post("/companies/me/logo")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .attach("logo", "tests/fixtures/profile-pic.jpg");
  expect(200);

  // test if uploaded file is buffer
  const comp = await Company.findById(companyID);
  expect(comp.logo).toEqual(expect.any(Buffer));
});

test("should update valid company fields", async () => {
  await request(app)
    .patch("/companies/me")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send({
      name: "updated",
    })
    .expect(200);

  const comp = await Company.findById(companyID);
  expect(comp.name).toEqual("updated");
});

test("should not update invalid company fields", async () => {
  await request(app)
    .patch("/companies/me")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send({
      city: "test",
    })
    .expect(404);
});

test("should get all registered companies profiles", async () => {
  await request(app)
    .get("/companies")
    .set("Authorization", `Bearer ${company.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get all registered companies profiles for unauthorized users", async () => {
  await request(app).get("/companies").send().expect(401);
});
