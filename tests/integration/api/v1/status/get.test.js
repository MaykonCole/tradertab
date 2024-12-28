import basetest from "../../../../basetest.js";

beforeAll(async () => {
  await basetest.stabilizesEnvironment("status");
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving API status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const version = responseBody.dependencies.database.version;
      expect(version).toEqual("16.0");
      const maxConnections = responseBody.dependencies.database.max_connections;
      expect(maxConnections).toEqual(100);

      const openedConnections =
        responseBody.dependencies.database.opened_connections;
      expect(openedConnections).toBeGreaterThan(1);
    });
  });
});
