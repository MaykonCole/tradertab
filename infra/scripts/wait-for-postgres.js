const { exec } = require("node:child_process");

const cmdCheckHTTPPostGres =
  "docker exec postgres-dev pg_isready --host localhost";

function checkConnectionPostgres() {
  exec(cmdCheckHTTPPostGres, handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkConnectionPostgres();
      return;
    }
    console.log("\n 🟢 PostGres está aceitando conexões.");
  }
}

process.stdout.write("\n 🟡 Aguardando o Postgress aceitar conexões!!\n");
checkConnectionPostgres();
