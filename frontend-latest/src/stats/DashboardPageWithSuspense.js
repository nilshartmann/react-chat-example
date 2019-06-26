import React from "react";
import { unstable_createResource } from "react-cache";
import { Main, Sidebar, Spinner } from "../components";
import { demo_delayFetch } from "../demo-help";

async function loadDataFromApi(path) {
  const response = await fetch(`http://localhost:9000${path}`);
  const json = await response.json();

  console.log(`loadDataFromApi '${path}'`, json);
  return json;
}

const LogsResource = unstable_createResource(() => demo_delayFetch(() => loadDataFromApi("/logs"), 350));
const UsersResource = unstable_createResource(() => demo_delayFetch(() => loadDataFromApi("/users"), 350));

function Logs() {
  const logs = LogsResource.read();

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
  const users = UsersResource.read();

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
        {/* Show spinners individually */}
        <React.Suspense fallback={<Spinner label="Loading Logs..." />}>
          <Logs />
        </React.Suspense>
        <React.Suspense fallback={<Spinner label="Loading User..." />}>
          <Users />
        </React.Suspense>
      </Main>
      <Sidebar>
        <button style={{ width: "100%" }} onClick={onClose}>
          Close
        </button>
      </Sidebar>
    </>
  );
}
