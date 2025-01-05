import { useState, useEffect } from "react";
import DataStatus from "../../components/status/datastatus";

async function fetchStatus() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const [dataStatus, setDataStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetchStatus();
        setDataStatus(response);
      } catch (error) {
        console.error("Erro ao buscar status:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (!dataStatus) {
    return <div>Carregando...</div>;
  }

  const database = dataStatus?.dependencies?.database || {};

  return (
    <>
      <div>
        <p>
          {" "}
          Última atualização :{" "}
          <b>
            {new Date(dataStatus.update_at).toLocaleString("pt-BR") ||
              "Carregando"}{" "}
          </b>
        </p>
        <h1>Status do Sistema</h1>

        <DataStatus database={database} />
      </div>
    </>
  );
}
