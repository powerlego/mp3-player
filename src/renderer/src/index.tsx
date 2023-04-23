import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Queue, QueueObject } from "./objects/QueueObject";

const client = new ApolloClient({
  uri: "http://localhost:8080/v1/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Queue.Provider value={new QueueObject()}>
        <App />
      </Queue.Provider>
    </ApolloProvider>
  </React.StrictMode>
);
