import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "../../../../infra/database.js";

export default async function migrations(request, response) {
  let dbClient;
  if (request.method === "GET" || request.method === "POST") {
    try {
      dbClient = await database.getNewClient();

      const defaultMigrations = {
        dbClient: dbClient,
        dryRun: true,
        dir: join("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations",
      };

      if (request.method === "GET") {
        console.log("Entrou no GET");
        const pendingMigrations = await migrationRunner(defaultMigrations);
        await dbClient.end();
        return response.status(200).json(pendingMigrations);
      }

      if (request.method === "POST") {
        console.log("Entrou no POST");
        const migratedMigrations = await migrationRunner({
          ...defaultMigrations,
          dryRun: false,
        });

        if (migratedMigrations.length > 0) {
          return response.status(201).json(migratedMigrations);
        }
        return response.status(200).json(migratedMigrations);
      }
    } catch (error) {
      console.log("Endpoint Migrations : " + error);
      throw error;
    } finally {
      await dbClient.end();
    }
  }

  return response.status(405).json({
    error: `Method not allowed : ${request.method}`,
  });
}
