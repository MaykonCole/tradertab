import basetest from "../../../../basetest.js";

beforeAll(async () => {
  await basetest.stabilizesEnvironment("migrations");
});

describe("POST/api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first", async () => {
        const responseCreated = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(responseCreated.status).toBe(201);

        const responseBodyCreated = await responseCreated.json();
        expect(Array.isArray(responseBodyCreated)).toBe(true);
        expect(responseBodyCreated.length).toBe(1);
      });
    });
  });

  describe("POST/api/v1/migrations", () => {
    describe("Anonymous user", () => {
      describe("Running pending migrations", () => {
        test("For the second", async () => {
          const responseSuccess = await fetch(
            "http://localhost:3000/api/v1/migrations",
            {
              method: "POST",
            },
          );

          expect(responseSuccess.status).toBe(200);
          const responseBodySuccess = await responseSuccess.json();
          expect(Array.isArray(responseBodySuccess)).toBe(true);
          expect(responseBodySuccess.length).toBe(0);
        });
      });
    });
  });
});
