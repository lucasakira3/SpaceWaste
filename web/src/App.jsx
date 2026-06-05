import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import OrbitalMap from "./components/OrbitalMap";
import Dashboard from "./components/Dashboard";
import SpaceFleetManager from "./components/SpaceFleetManager";

import { initialDebris, initialSpaceTrucks } from "./services/orbitalService";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [debrisList, setDebrisList] = useState(initialDebris);
  const [spaceTrucks, setSpaceTrucks] = useState(initialSpaceTrucks);

  return (
    <>
      {/* HUD Navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Roteador Simples Baseado em Estado */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {currentPage === "home" && <Home setCurrentPage={setCurrentPage} />}

        {currentPage === "map" && (
          <OrbitalMap
            debrisList={debrisList}
            setDebrisList={setDebrisList}
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}

        {currentPage === "dashboard" && (
          <Dashboard
            debrisList={debrisList}
            setDebrisList={setDebrisList}
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}

        {currentPage === "fleet" && (
          <SpaceFleetManager
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}
      </main>

      {/* Futuristic Academic HUD Footer */}
      <footer
        style={{
          padding: "20px 40px",
          borderTop: "var(--border-hud)",
          background: "rgba(5, 8, 22, 0.9)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-hud)",
          letterSpacing: "0.5px",
        }}
      >
        <div>
          STATUS DO LINK ORBITAL:{" "}
          <span style={{ color: "var(--color-green)", fontWeight: "bold" }}>
            NOMINAL (LEO/GEO ACTIVE)
          </span>
        </div>
        <div>FIAP &copy; 2026 | Global Solution — Code Crew 2026</div>
        <div>CÓDIGO OPERACIONAL: SW-V2.6.4</div>
      </footer>
    </>
  );
}

export default App;
