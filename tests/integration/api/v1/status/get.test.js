import basetest from "../../../../basetest.js";

beforeAll(async () => {
  await basetest.stabilizesEnvironment("status");
});

test("GET api/v1/status should return status code 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  console.log(responseBody.dependencies.database.opened_connections);
  const version = responseBody.dependencies.database.version;
  expect(version).toEqual("16.0");
  const maxConnections = responseBody.dependencies.database.max_connections;
  expect(maxConnections).toEqual(100);

  const openedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(openedConnections).toBeLessThan(3);
});
