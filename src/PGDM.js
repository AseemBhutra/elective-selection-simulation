import React from "react";
import ElectiveSimulator from "./components/ElectiveSimulator";
import { pgdmConfig } from "./data/pgdmConfig";

function PGDM() {
  return <ElectiveSimulator config={pgdmConfig} />;
}

export default PGDM;
