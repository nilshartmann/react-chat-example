import React from "react";
import { Main, Sidebar, Spinner } from "../components";

function CPUs({ cpusResource }) {
  const cpus = cpusResource.read();

  return (
    <div>
      <h2>Server CPUs</h2>

      <table className="CpuTable">
        <thead>
          <tr>
            <th>Model</th>
            <th>Speed</th>
            <th>User (ms)</th>
            <th>Idle (ms)</th>
          </tr>
        </thead>
        <tbody>
          {cpus.map(c => (
            <tr key={c.id}>
              <td>{c.model}</td>
              <td>{c.speed}</td>
              <td>{c.times.user}</td>
              <td>{c.times.idle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

export default function DashboardPageWithSuspense({ onClose, dashboardData }) {
  return (
    <>
      <Main>
        <h1>Admin Dashboard</h1>
        <CPUs cpusResource={dashboardData.cpus} />
        <React.SuspenseList revealOrder="forwards">
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
