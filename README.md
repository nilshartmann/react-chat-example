# React Chat Example

Example application to show (new) React features:

- Code splitting with suspense and [React.lazy](https://reactjs.org/docs/code-splitting.html#reactlazy)
- Pure functional components with [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)
- [Hooks API](https://reactjs.org/docs/hooks-intro.html)

The following features from React 16.8 all are **experimental** and considered to be unstable! APIs might change, so be careful and make sure you checkout the latest React Docs etc for up-to-date informations:

- Concurrent Mode
- Suspense for Resource loading

The application uses socket.io for the server communication.

![Example Application](react-chat-app.gif)

# Run the example

The example consists of a backend and two frontends. There is one frontend that only uses stable React features (currently: 16.8) and one frontend that also uses unstable, experimental features from the upcoming 16.8+ React releases. Both frontends are more or less "feature identical" but using different React APIs.

## Start the backend

The backend will listen on `localhost:9000`, so please make sure this port is available before running the server.

```
cd backend
yarn
yarn start
```

## Start the 1. frontend (React 16.8)

This frontend will listen on port 9080, so please make sure, this port is not in use.

```
cd frontend
yarn
yarn start
```

## Start the 2. frontend (React 16.8 UNSTABLE apis)

This frontend runs on port 9081, so please make sure this port is not in use.

```
cd frontend-latest
yarn
yarn start
```

# Using the examples

You can connect to the frontends using:

- `http://localhost:9080` for the React 16-based version
- `http://localhost:9081` for the React 16.8-based version

In order to post messages to the chat, you have to _login_ with one of the following users (no password required):

- susi, sue, maja, klaus, harry, peter, olivia, cathy

## Delaying the application

For a better visualization of the suspense and concurrent features, you can "slow down" the application. To do so, either use your browser's dev tools to slow down the network connection or use one or both of the following query params:

- `delay` slows down most network requests (you can for example see a loading spinner when react loads the "splitted" components and also the avatars gets loaded slower, showing a default icon until they are read)

- `delayfetch` slows down the `fetch` requests on the `Dashboard` pages (you can see loading spinners on `Dashboard with Suspense`)

# Feedback

In case you have questions or comments you can open an issue. You can also reach me on [twitter](https://twitter.com/nilshartmann)
