import database from "/infra/database.js";

async function status(request, response) {
  const dataAtual = await new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datName = current_database()",
  );

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: dataAtual,
    dependencies: {
      database: {
        version: databaseVersionValue,
        opened_connections: databaseOpenedConnectionsValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
      },
    },
  });
}

export default status;
