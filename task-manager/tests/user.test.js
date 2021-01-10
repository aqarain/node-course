const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Atif",
      email: "a@gmail.com",
      password: "xyz123"
    })
    .expect(201);

  // Assert that the db was changed correctly
  const user = User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Atif",
      email: "a@gmail.com"
    }
  });
  expect(user.password).not.toBe("xyz123");
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: "aa@gmail.com",
      password: "seadsf323"
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for an unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete accountfor user", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete account for an unauthenticated user", async () => {
  await request(app).delete("/user/me").send().expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/user/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer)); // We are looking at the avatart porperty and checking if it equals any buffer
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Jes" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Jes");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Jes" })
    .expect(400);
});
