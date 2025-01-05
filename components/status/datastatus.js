export default function DataStatus({ database }) {
  function GetEnviroment(enviroment) {
    if (enviroment === "development") {
      return "Desenvolvimento";
    } else if (enviroment === "production") {
      return "Produção";
    } else if (enviroment === "test") {
      return "Testes";
    } else if (enviroment === "staging") {
      return "Homologação";
    } else {
      return "Outro";
    }
  }

  return (
    <>
      <ul>
        <div>
          <p>Banco de Dados em : {GetEnviroment(process.env.NODE_ENV)} </p>
        </div>
        <li>
          Versão: <b>{database?.version || "Indisponível"}</b>
        </li>
        <li>
          Máximas conexões suportadas:{" "}
          <b>{database?.max_connections || "Indisponível"}</b>
        </li>
        <li>
          Conexões em uso:{" "}
          <b>{database?.opened_connections || "Indisponível"}</b>
        </li>
      </ul>
    </>
  );
}
