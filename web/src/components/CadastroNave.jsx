import React, { useState } from "react";
import "../styles/CadastroNave.css";

const TIPOS_NAVE = [
  { value: "cargo", label: "Carga" },
  { value: "passageiros", label: "Passageiros" },
  { value: "coleta", label: "Coleta de Detritos" },
  { value: "reconhecimento", label: "Reconhecimento" },
  { value: "utilitaria", label: "Utilitária" },
];

export default function CadastroNave({ spaceTrucks, setSpaceTrucks, onBack }) {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("coleta");
  const [capacidade, setCapacidade] = useState(5000);
  const [combustivel, setCombustivel] = useState(100);
  const [status, setStatus] = useState("DISPONIVEL");
  const [isManufacturing, setIsManufacturing] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id || !nome.trim()) {
      setMessage({ text: "Erro: ID e Nome da Nave são obrigatórios!", type: "danger" });
      return;
    }

    const shipIdNum = parseInt(id);

    // Validar se ID já existe
    if (spaceTrucks.some((t) => t.id === shipIdNum)) {
      setMessage({ text: `Erro: O ID de Nave "${shipIdNum}" já está em uso na frota!`, type: "danger" });
      return;
    }

    setMessage({ text: "", type: "" });
    setIsManufacturing(true);
    setBuildProgress(0);

    // Simulação do processo de montagem e impressão 3D orbital
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setBuildProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Adicionar nova nave ao estado
        const newShip = {
          id: shipIdNum,
          nome: nome.trim(),
          tipo: tipo,
          capacidadeMaxKg: parseFloat(capacidade) || 5000,
          cargaAtualKg: 0,
          combustivelPercent: parseFloat(combustivel) || 100,
          status: status,
          tripulantes: [],
          cargasCompartimentadas: [],
          altitudeKm: status === "MANUTENCAO" ? 0.0 : 400.0 + Math.random() * 500.0, // Altitude em órbita baixa LEO
          inclinacaoGraus: status === "MANUTENCAO" ? 0.0 : 20.0 + Math.random() * 80.0,
          longitudeGraus: status === "MANUTENCAO" ? 0.0 : Math.random() * 360.0,
        };

        setSpaceTrucks((prev) => [...prev, newShip]);
        setIsManufacturing(false);
        setMessage({ text: `Space Truck "${nome}" montado e implantado com sucesso!`, type: "success" });

        // Resetar form
        setId("");
        setNome("");
        setTipo("coleta");
        setCapacidade(5000);
        setCombustivel(100);
        setStatus("DISPONIVEL");
      }
    }, 200);
  };

  return (
    <div className="ship-registration">
      <header className="page-header" style={{ marginBottom: "20px" }}>
        <h1 style={{ color: "var(--color-cyan)", textShadow: "0 0 10px var(--color-cyan-glow)" }}>
          🛠️ Estaleiro Orbital — Cadastro de Novas Naves
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Inicie a montagem de um novo Space Truck integrando ligas avançadas e propulsão RCS para coleta de detritos.
        </p>
      </header>

      {message.text && (
        <div className={`alert-message ${message.type === "success" ? "success" : "danger"}`}>
          {message.text}
        </div>
      )}

      <div className="ship-grid" style={{ position: "relative" }}>
        {isManufacturing && (
          <div className="manufacturing-overlay">
            <div className="manufacturing-spinner"></div>
            <div className="manufacturing-text">
              Manufaturando Fuselagem e Calibrando RCS... {buildProgress}%
            </div>
          </div>
        )}

        {/* Form Registration */}
        <div className="reg-card cyan-border">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <div className="corner-hud corner-bottom-left"></div>
          <div className="corner-hud corner-bottom-right"></div>

          <h3 style={{ color: "var(--color-cyan)", marginBottom: "15px" }}>Ordem de Produção</h3>

          <form onSubmit={handleSubmit} className="astronaut-form">
            <div className="form-row">
              <div className="form-group">
                <label>Serial / ID da Nave *</label>
                <input
                  type="number"
                  min="1"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Ex: 5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nome da Nave *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: SW-Omega"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Operação</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {TIPOS_NAVE.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status Operacional</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="EM_MISSAO">Em Missão</option>
                  <option value="MANUTENCAO">Manutenção</option>
                  <option value="DESATIVADA">Desativada</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Capacidade Carga (kg)</label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={capacidade}
                  onChange={(e) => setCapacidade(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Combustível Inicial (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={combustivel}
                  onChange={(e) => setCombustivel(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-hud" style={{ width: "100%", marginTop: "10px" }}>
              <span>Autorizar Construção</span>
            </button>
          </form>
        </div>

        {/* Blueprint Visualizer Card */}
        <div className="reg-card magenta-border">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <div className="corner-hud corner-bottom-left"></div>
          <div className="corner-hud corner-bottom-right"></div>

          <div className="spec-preview">
            <h4>Especificações Estruturais (Blueprint)</h4>
            
            <div className="blueprint-display">
              <div className="blueprint-grid-lines"></div>
              {/* Space ship vector blueprint */}
              <svg
                className="blueprint-svg"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="50,15 65,45 85,60 85,85 50,75 15,85 15,60 35,45" />
                <line x1="50" y1="15" x2="50" y2="75" />
                <line x1="15" y1="60" x2="85" y2="60" />
                <line x1="35" y1="45" x2="65" y2="45" />
                <circle cx="50" cy="40" r="4" />
                {/* Thrusters */}
                <rect x="25" y="85" width="8" height="6" />
                <rect x="67" y="85" width="8" height="6" />
              </svg>
            </div>

            <div className="spec-list">
              <div className="spec-row">
                <span className="spec-label">Nave Identificador:</span>
                <span className="spec-val">{id ? `SW-${id}` : "Aguardando..."}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Fuselagem Base:</span>
                <span className="spec-val">{nome || "Aguardando..."}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Tipo de Chassi:</span>
                <span className="spec-val">
                  {TIPOS_NAVE.find((t) => t.value === tipo)?.label || "N/A"}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Módulo Propulsor:</span>
                <span className="spec-val">RCS-Delta V (Híbrido)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Empuxo Teórico:</span>
                <span className="spec-val">{(capacidade * 0.08).toFixed(1)} kN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
