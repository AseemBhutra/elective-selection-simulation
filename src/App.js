import React from "react";
import ElectiveSimulator from "./components/ElectiveSimulator";
import { pgpmConfig } from "./data/pgpmConfig";

function App() {
  return <ElectiveSimulator config={pgpmConfig} />;
}

export default App;
