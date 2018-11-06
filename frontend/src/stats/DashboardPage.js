import React from "react";
import { Main, Sidebar, Spinner } from "../components";

async function loadDataFromApi(path) {
  const response = await fetch(`http://localhost:9000${path}`);
  const json = await response.json();

  console.log(`loadDataFromApi '${path}'`, json);
  return json;
}

class Logs extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  async componentDidMount() {
    const logs = await loadDataFromApi("/logs");
    this.setState({ logs });
  }

  render() {
    const { logs } = this.state;

    if (!logs) {
      return <Spinner label="Loading Logs..." />;
    }

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
}

class Users extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  async componentDidMount() {
    const users = await loadDataFromApi("/users");
    this.setState({ users });
  }

  render() {
    const { users } = this.state;

    if (!users) {
      return <Spinner label="Loading Users..." />;
    }

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
}

export default function DashboardPage({ onClose }) {
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
