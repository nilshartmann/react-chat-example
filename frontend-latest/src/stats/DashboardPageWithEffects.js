import React from "react";
import { Main, Sidebar } from "../components";

function useFetch(path, initialData) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    async function loadData() {
      const response = await fetch(`http://localhost:9000${path}`);
      const json = await response.json();

      setData(json);
    }
    loadData();
  }, []);

  return data;
}

function Logs() {
  const logs = useFetch("/logs", []);

  return (
    <div>
      <h2>Logs</h2>
      <code>
        {logs.map(l => (
          <p key={l.eventId}>
            [{l.user}] {l.msg}
          </p>
        ))}
      </code>
    </div>
  );
}

function Users() {
  const users = useFetch("/users", []);

  return (
    <div>
      <h2>User</h2>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPageWithEffects({ onClose }) {
  return (
    <>
      <Main>
        <h1>Admin Dashboard</h1>

        <Logs />
        <Users />
      </Main>
      <Sidebar>
        <button style={{ width: "100%" }} onClick={onClose}>
          Close
        </button>
      </Sidebar>
    </>
  );
}
