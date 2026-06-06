import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import OrbitalMap from "./components/OrbitalMap";
import Dashboard from "./components/Dashboard";
import SpaceFleetManager from "./components/SpaceFleetManager";
import WelcomeGuide, { resetGuide } from "./components/WelcomeGuide";
import Login from "./components/Login";
import CadastroAstronauta from "./components/CadastroAstronauta";
import CadastroNave from "./components/CadastroNave";

import { initialDebris, initialSpaceTrucks } from "./services/orbitalService";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("spacewaste_isLoggedIn") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("spacewaste_currentUser");
    return user ? JSON.parse(user) : null;
  });

  const [currentPage, setCurrentPage] = useState("home");

  const [debrisList, setDebrisList] = useState(initialDebris);
  const [spaceTrucks, setSpaceTrucks] = useState(initialSpaceTrucks);
  const [guideKey, setGuideKey] = useState(0);

  const handleReopenGuide = () => {
    resetGuide();
    setGuideKey((k) => k + 1);
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setCurrentPage("home");
    localStorage.setItem("spacewaste_isLoggedIn", "true");
    localStorage.setItem("spacewaste_currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage("home");
    localStorage.removeItem("spacewaste_isLoggedIn");
    localStorage.removeItem("spacewaste_currentUser");
  };

  // Impedir acesso não autorizado a rotas privadas se deslogado
  useEffect(() => {
    const publicPages = ["home", "login", "cadastrar-astronauta-public"];
    if (!isLoggedIn && !publicPages.includes(currentPage)) {
      setCurrentPage("home");
    }
  }, [isLoggedIn, currentPage]);

  return (
    <>
      {isLoggedIn && <WelcomeGuide key={guideKey} />}

      {/* HUD Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Roteador Simples Baseado em Estado */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {currentPage === "home" && (
          <Home setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} />
        )}

        {isLoggedIn && currentPage === "map" && (
          <OrbitalMap
            debrisList={debrisList}
            setDebrisList={setDebrisList}
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}

        {isLoggedIn && currentPage === "dashboard" && (
          <Dashboard
            debrisList={debrisList}
            setDebrisList={setDebrisList}
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}

        {isLoggedIn && currentPage === "fleet" && (
          <SpaceFleetManager
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
          />
        )}

        {isLoggedIn && currentPage === "cadastrar-astronauta" && (
          <CadastroAstronauta
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
            isPublic={false}
          />
        )}

        {isLoggedIn && currentPage === "cadastrar-nave" && (
          <CadastroNave
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
            onBack={() => setCurrentPage("fleet")}
          />
        )}

        {!isLoggedIn && currentPage === "login" && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoToSignUp={() => setCurrentPage("cadastrar-astronauta-public")}
          />
        )}

        {!isLoggedIn && currentPage === "cadastrar-astronauta-public" && (
          <CadastroAstronauta
            spaceTrucks={spaceTrucks}
            setSpaceTrucks={setSpaceTrucks}
            isPublic={true}
            onBack={() => setCurrentPage("login")}
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
          {currentUser && (
            <span style={{ marginLeft: "15px", color: "var(--color-cyan)", fontWeight: "bold" }}>
              | OPERADOR ATIVO: {currentUser.nome.toUpperCase()} ({currentUser.credentialId})
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          FIAP &copy; 2026 | Global Solution — Code Crew 2026
          <button
            onClick={handleReopenGuide}
            title="Abrir guia de uso"
            style={{
              background: "none",
              border: "1px solid rgba(0,240,255,0.25)",
              color: "rgba(0,240,255,0.6)",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "700",
              lineHeight: 1,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </button>
        </div>
        <div>CÓDIGO OPERACIONAL: SW-V2.6.4</div>
      </footer>
    </>
  );
}

export default App;


