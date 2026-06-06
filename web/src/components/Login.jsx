import React, { useState, useEffect } from "react";
import "../styles/Login.css";

// Banco de credenciais iniciais
const DEFAULT_CREDENTIALS = [
  { credentialId: "ASTRO-01", passcode: "12345", nome: "Operador Principal", cargo: "Administrador do HUD", naveId: null },
  { credentialId: "ASTRO-YURI", passcode: "12345", nome: "Yuri Petrov", cargo: "Piloto Orbital", naveId: 1 },
  { credentialId: "ASTRO-AKIRA", passcode: "12345", nome: "Akira Tanaka", cargo: "Eng. de Sistemas", naveId: 1 },
  { credentialId: "ASTRO-MIA", passcode: "12345", nome: "Mia Santos", cargo: "Especialista Coleta", naveId: 1 },
];

export default function Login({ onLoginSuccess, onGoToSignUp }) {
  const [credentialId, setCredentialId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [scanState, setScanState] = useState("idle"); // idle, scanning, success, failed
  const [scanPercent, setScanPercent] = useState(0);

  // Garantir carregamento inicial das credenciais no localStorage
  useEffect(() => {
    const stored = localStorage.getItem("spacewaste_credentials");
    if (!stored) {
      localStorage.setItem("spacewaste_credentials", JSON.stringify(DEFAULT_CREDENTIALS));
    }
  }, []);

  const handleStartScan = () => {
    if (!credentialId.trim() || !passcode.trim()) {
      setErrorMsg("Insira o ID da Credencial e a Senha de Acesso primeiro!");
      setScanState("failed");
      return;
    }

    setErrorMsg("");
    setScanState("scanning");
    setScanPercent(0);

    // Animação de progresso do scanner biométrico
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 10;
      setScanPercent(currentPercent);
      if (currentPercent >= 100) {
        clearInterval(interval);
        verifyCredentials();
      }
    }, 150);
  };

  const verifyCredentials = () => {
    const stored = localStorage.getItem("spacewaste_credentials");
    const database = stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;

    const matchedUser = database.find(
      (u) =>
        u.credentialId.trim().toUpperCase() === credentialId.trim().toUpperCase() &&
        u.passcode.trim() === passcode.trim()
    );

    if (matchedUser) {
      setScanState("success");
      setTimeout(() => {
        onLoginSuccess(matchedUser);
      }, 1000);
    } else {
      setScanState("failed");
      setErrorMsg("Acesso Negado. Credenciais orbitais inválidas ou biometria incompatível.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Corner HUD decorations */}
        <div className="corner-hud corner-top-left"></div>
        <div className="corner-hud corner-top-right"></div>
        <div className="corner-hud corner-bottom-left"></div>
        <div className="corner-hud corner-bottom-right"></div>

        <div className="login-header">
          <div className="login-logo">
            <svg
              className="login-logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span className="logo-text">SpaceWaste</span>
          </div>
          <h2 className="login-title">Autenticação HUD</h2>
          <div className="login-subtitle">Acesso ao Comando da Missão</div>
        </div>

        {errorMsg && (
          <div className="alert-message danger">
            {errorMsg}
          </div>
        )}

        {scanState === "success" && (
          <div className="alert-message success">
            Acesso Concedido. Inicializando HUD...
          </div>
        )}

        <div className="login-form">
          <div className="form-field">
            <label>ID da Credencial Astronauta</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Ex: ASTRO-01"
                disabled={scanState === "scanning" || scanState === "success"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStartScan();
                }}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Código de Acesso (Senha)</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Ex: 12345"
                disabled={scanState === "scanning" || scanState === "success"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStartScan();
                }}
              />
            </div>
          </div>
        </div>

        <div className="biometric-scanner-area">
          <div
            className={`scanner-box ${scanState === "scanning" ? "scanning" : ""}`}
            onClick={scanState !== "scanning" && scanState !== "success" ? handleStartScan : undefined}
          >
            <div className="laser-line"></div>
            {/* Fingerprint Vector */}
            <svg
              className="scanner-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2a10 10 0 0 0-8 4M12 2a10 10 0 0 1 8 4" />
              <path d="M2 12a10 10 0 0 0 4 8M22 12a10 10 0 0 1-4 8" />
              <path d="M8 12a4 4 0 0 1 8 0" />
              <path d="M6 12a6 6 0 0 1 12 0" />
              <path d="M10 12a2 2 0 0 1 4 0" />
              <path d="M12 12v.01" />
            </svg>
          </div>
          <div
            className={`scan-status-text ${
              scanState === "scanning"
                ? "scanning"
                : scanState === "success"
                ? "success"
                : scanState === "failed"
                ? "failed"
                : ""
            }`}
          >
            {scanState === "scanning" && `Verificando Identidade: ${scanPercent}%`}
            {scanState === "success" && "Biometria Autenticada!"}
            {scanState === "failed" && "Scanner Biométrico Travado!"}
            {scanState === "idle" && "Clique na digital para iniciar scanner"}
          </div>
        </div>

        <div className="register-redirect">
          Não é tripulante?{" "}
          <span className="register-link" onClick={onGoToSignUp}>
            Cadastrar Astronauta
          </span>
        </div>
      </div>
    </div>
  );
}
