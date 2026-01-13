import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatuPage() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 20000,
  });

  if (isLoading)
    return <h1 style={{ color: "rgba(216, 139, 24, 1)" }}>Carregando...</h1>;

  if (!isLoading)
    return (
      <>
        <h1 style={{ color: "rgba(30, 216, 24, 1)" }}>Status OK</h1>

        <div>
          Ultima atualizaçao:{" "}
          {new Date(data.updated_at).toLocaleString("pt-BR")}
        </div>
        <h2 style={{ color: "rgba(21, 56, 214, 1)" }}>Database:</h2>

        <div>Versao: {data.dependencies.database.version}</div>

        <div>Conexoes maxima: {data.dependencies.database.max_connections}</div>

        <div>
          Conexoes ativas: {data.dependencies.database.current_connections}
        </div>
      </>
    );
}
