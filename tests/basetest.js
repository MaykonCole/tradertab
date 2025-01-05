import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    retry(fechStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fechStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function stabilizesEnvironment(endpoint) {
  async function cleanDatabase() {
    await database.query("drop schema public cascade; create schema public;");
  }
  await waitForAllServices();
  if (endpoint === "migrations") await cleanDatabase();
}

const testUtils = { stabilizesEnvironment };

export default testUtils;
