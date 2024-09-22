import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const defaultMigrations = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    console.log("Entrou no GET");
    const pendingMigrations = await migrationRunner(defaultMigrations);
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

  return response.status(405);
}
