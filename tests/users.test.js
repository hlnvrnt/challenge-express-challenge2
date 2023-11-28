const request = require("supertest");

const app = require("../src/app");

const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});


const crypto = require("node:crypto");

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname : "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city : "Paris",
      language : "French",
    }

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    expect(response.body).toHaveProperty("firstname");
    expect(typeof response.body.firstname).toBe("string");

    expect(response.body).toHaveProperty("lastname");
    expect(typeof response.body.lastname).toBe("string");

    expect(response.body).toHaveProperty("email");
    expect(typeof response.body.email).toBe("string");

    expect(response.body).toHaveProperty("city");
    expect(typeof response.body.city).toBe("string");

    expect(response.body).toHaveProperty("language");
    expect(typeof response.body.language).toBe("string");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(newUser.lastname);
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(newUser.email);
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(newUser.city);
    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(newUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "James",
      lastname: "Cameron",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "London",
      language:"English",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Johanna",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "English"
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [result2] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [usersInDatabase] = result2;

    expect(usersInDatabase).toHaveProperty("id");

    expect(usersInDatabase).toHaveProperty("firstname");
    expect(usersInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(usersInDatabase).toHaveProperty("lastname");
    expect(usersInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(usersInDatabase).toHaveProperty("email");
    expect(usersInDatabase.email).toStrictEqual(updatedUser.email);

    expect(usersInDatabase).toHaveProperty("city");
    expect(usersInDatabase.city).toStrictEqual(updatedUser.city);

    expect(usersInDatabase).toHaveProperty("language");
    expect(usersInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "James" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
});

it("should return no user", async () => {
  const newUser = {
      firstname: "James",
      lastname: "Cameron",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "London",
      language:"English",
  };

  const response = await request(app).put("/api/users/0").send(newUser);

  expect(response.status).toEqual(404);
});

});
