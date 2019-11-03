function loadDataFromApi(path) {
  return fetch(`http://localhost:9000${path}`).then(response => response.json());
}

export function loadDashboardData() {
  const logsPromise = wrapDelay("Loading Logs", () => loadDataFromApi("/logs"), 1350);
  const usersPromise = wrapDelay("Loading Users", () => loadDataFromApi("/users"), 300);

  return {
    logs: wrapPromise(logsPromise),
    users: wrapPromise(usersPromise)
  };
}

function wrapDelay(msg, fn, delay) {
  return new Promise(resolve => {
    console.log(`Start '${msg}' >>>>>>>> `);
    setTimeout(() => {
      console.log(`<<<<<<<< Finish '${msg}'`);
      resolve(fn());
    }, delay || randomDelay());
  });
}

function randomDelay() {
  return (Math.floor(Math.random() * 4) + 2) * 500;
}

// TAKEN FROM REACT CONCURRENT EXAMPLES

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// ---> Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = "pending";
  let result;
  const suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}
