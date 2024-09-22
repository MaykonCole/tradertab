import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("GET api/v1/migrations should return status code 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  console.log("Ambiente de :" + process.env.NODE_ENV);

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);
});