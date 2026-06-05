import React from "react";

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div
        className="logo-container"
        onClick={() => setCurrentPage("home")}
        style={{ cursor: "pointer" }}
      >
        {/* Pulsing Space Debris / Satellite SVG Icon */}
        <svg
          className="logo-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          <path d="M12 8a4 4 0 0 1 4 4" />
          <path d="M9 12a3 3 0 0 1 3-3" />
        </svg>
        <span className="logo-text">SpaceWaste</span>
      </div>
      <div className="nav-links">
        <button
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => setCurrentPage("home")}
        >
          Painel de Lançamento (Home)
        </button>
        <button
          className={`nav-link ${currentPage === "map" ? "active" : ""}`}
          onClick={() => setCurrentPage("map")}
        >
          Mapa de Rotas
        </button>
        <button
          className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentPage("dashboard")}
        >
          Painel Operacional
        </button>
        <button
          className={`nav-link ${currentPage === "fleet" ? "active" : ""}`}
          onClick={() => setCurrentPage("fleet")}
        >
          Gerenciar Frota
        </button>
      </div>
    </nav>
  );
}
