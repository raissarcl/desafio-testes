import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from 'supertest';

let connection: Connection;

jest.setTimeout(10000);

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create an user", async () => {

    const response = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@email.com",
      password: "1234567"
    });

    expect(response.status).toBe(201);

  });

})
