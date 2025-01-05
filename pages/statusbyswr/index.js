import useSWR from "swr";
import DataStatus from "../../components/status/datastatus";

async function fetchStatus() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const response = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  return (
    <>
      <UpdateAt />
      <div>
        <h1> Status do Sistema </h1>
        <DataStatus database={response?.data?.dependencies?.database} />
      </div>
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  let text = "Carregando ...";

  if (!isLoading && data) {
    text = new Date(data.update_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      Última atualização : <b>{text} </b>
    </div>
  );
}
