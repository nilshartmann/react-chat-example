import React from "react";
import { Main, Sidebar, Spinner } from "../components";
import { loadDashboardData } from "../fakeApi";

function Logs({ logsResource }) {
  const logs = logsResource.read();

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

function Users({ usersResource }) {
  const users = usersResource.read();

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

const dashboardData = loadDashboardData();

export default function DashboardPageWithSuspense({ onClose }) {
  return (
    <>
      <Main>
        <h1>Admin Dashboard</h1>
        <React.SuspenseList revealOrder="backwards">
          <React.Suspense fallback={<Spinner label="Loading Logs..." />}>
            <Logs logsResource={dashboardData.logs} />
          </React.Suspense>
          <React.Suspense fallback={<Spinner label="Loading User..." />}>
            <Users usersResource={dashboardData.users} />
          </React.Suspense>
        </React.SuspenseList>
      </Main>
      <Sidebar>
        <button style={{ width: "100%" }} onClick={onClose}>
          Close
        </button>
      </Sidebar>
    </>
  );
}
