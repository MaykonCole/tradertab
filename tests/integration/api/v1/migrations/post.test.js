import basetest from "../../../../basetest.js";

beforeAll(async () => {
  await basetest.stabilizesEnvironment("migrations");
});

test("POST api/v1/migrations should return status code 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);
});
