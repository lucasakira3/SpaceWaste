import React, { useState, useEffect } from "react";
import "../styles/CadastroAstronauta.css";

const CARGOS = [
  "Piloto Orbital",
  "Eng. de Propulsão",
  "Eng. de Sistemas",
  "Especialista Coleta",
  "Cientista Orbital",
  "Médico Espacial",
  "Técnico de Telemetria",
];

export default function CadastroAstronauta({ spaceTrucks, setSpaceTrucks, isPublic, onBack }) {
  const [nome, setNome] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [cargo, setCargo] = useState(CARGOS[0]);
  const [experiencia, setExperiencia] = useState(0);
  const [shipId, setShipId] = useState("");
  const [astronautsList, setAstronautsList] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Carregar lista de credenciais / astronautas do localStorage
  const loadAstronauts = () => {
    const stored = localStorage.getItem("spacewaste_credentials");
    if (stored) {
      setAstronautsList(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadAstronauts();
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!nome.trim() || !credentialId.trim() || !passcode.trim()) {
      setMessage({ text: "Erro: Todos os campos com * são obrigatórios!", type: "danger" });
      return;
    }

    const cleanCredId = credentialId.trim().toUpperCase();

    // Validar se credencial já existe
    const stored = localStorage.getItem("spacewaste_credentials");
    let database = stored ? JSON.parse(stored) : [];

    if (database.some((user) => user.credentialId.toUpperCase() === cleanCredId)) {
      setMessage({ text: `Erro: A credencial ID "${cleanCredId}" já está cadastrada!`, type: "danger" });
      return;
    }

    const assignedShipId = shipId ? parseInt(shipId) : null;
    const newAstronaut = {
      credentialId: cleanCredId,
      passcode: passcode.trim(),
      nome: nome.trim(),
      cargo: cargo,
      funcao: cargo, // Manter compatibilidade com nomenclatura existente
      experienciaAnos: parseInt(experiencia) || 0,
      naveId: assignedShipId,
    };

    // 1. Salvar no localStorage de credenciais
    database.push(newAstronaut);
    localStorage.setItem("spacewaste_credentials", JSON.stringify(database));

    // 2. Se alocado a uma nave, atualizar o estado global spaceTrucks
    if (assignedShipId !== null) {
      setSpaceTrucks((prevTrucks) =>
        prevTrucks.map((truck) => {
          if (truck.id === assignedShipId) {
            const currentCrew = truck.tripulantes || [];
            // Evitar duplicados na nave
            if (!currentCrew.some((c) => c.nome === newAstronaut.nome)) {
              return {
                ...truck,
                tripulantes: [
                  ...currentCrew,
                  {
                    id: Date.now(), // ID temporário para listagem interna da nave
                    nome: newAstronaut.nome,
                    funcao: newAstronaut.cargo,
                    experienciaAnos: newAstronaut.experienciaAnos,
                  },
                ],
              };
            }
          }
          return truck;
        })
      );
    }

    setMessage({ text: `Recrutamento de ${nome} efetuado com sucesso!`, type: "success" });
    
    // Resetar campos
    setNome("");
    setCredentialId("");
    setPasscode("");
    setExperiencia(0);
    setCargo(CARGOS[0]);
    setShipId("");

    // Recarregar lista
    loadAstronauts();

    // Se for cadastro público, retornar após sucesso
    if (isPublic) {
      setTimeout(() => {
        onBack();
      }, 1500);
    }
  };

  const handleDelete = (credId, astroNome, nId) => {
    if (window.confirm(`Tem certeza que deseja descredenciar o astronauta ${astroNome}?`)) {
      // Remover do banco de credenciais
      const stored = localStorage.getItem("spacewaste_credentials");
      if (stored) {
        const database = JSON.parse(stored);
        const filtered = database.filter((a) => a.credentialId !== credId);
        localStorage.setItem("spacewaste_credentials", JSON.stringify(filtered));
      }

      // Remover do tripulante da nave se aplicável
      if (nId !== null && nId !== undefined) {
        setSpaceTrucks((prevTrucks) =>
          prevTrucks.map((truck) => {
            if (truck.id === nId) {
              return {
                ...truck,
                tripulantes: (truck.tripulantes || []).filter((c) => c.nome !== astroNome),
              };
            }
            return truck;
          })
        );
      }

      setMessage({ text: `Astronauta ${astroNome} removido dos registros orbitais.`, type: "success" });
      loadAstronauts();
    }
  };

  return (
    <div className="astronaut-registration">
      <header className="page-header" style={{ marginBottom: "20px" }}>
        <h1 style={{ color: "var(--color-cyan)", textShadow: "0 0 10px var(--color-cyan-glow)" }}>
          👨‍🚀 Recrutamento e Cadastro de Astronautas
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Cadastre novos tripulantes no banco de dados operacional e aloque-os para missões a bordo da frota Space Waste.
        </p>
      </header>

      {message.text && (
        <div className={`alert-message ${message.type === "success" ? "success" : "danger"}`}>
          {message.text}
        </div>
      )}

      <div className="astronaut-grid">
        {/* Form Registration Card */}
        <div className="reg-card magenta-border">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <div className="corner-hud corner-bottom-left"></div>
          <div className="corner-hud corner-bottom-right"></div>

          <h3 style={{ color: "var(--color-magenta)", marginBottom: "15px" }}>Ficha Cadastral</h3>
          
          <form onSubmit={handleRegister} className="astronaut-form">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Neil Armstrong"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Credencial ID * (Acesso Login)</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="Ex: ASTRO-NEIL"
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha de Acesso *</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Ex: 12345"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Função / Cargo</label>
                <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Anos de Experiência</label>
                <input
                  type="number"
                  min="0"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Designação de Nave (Opcional)</label>
              <select value={shipId} onChange={(e) => setShipId(e.target.value)}>
                <option value="">Reserva — Sem nave alocada</option>
                {spaceTrucks.map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {truck.nome} (Status: {truck.status})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-hud btn-hud-danger" style={{ width: "100%", marginTop: "10px" }}>
              <span>Registrar Astronauta</span>
            </button>
          </form>
        </div>

        {/* List of Registered Astronauts Card */}
        <div className="reg-card cyan-border">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <div className="corner-hud corner-bottom-left"></div>
          <div className="corner-hud corner-bottom-right"></div>

          <div className="astronaut-list-container">
            <h3 style={{ color: "var(--color-cyan)", marginBottom: "15px" }}>
              Tripulantes Ativos ({astronautsList.length})
            </h3>

            <div className="astronaut-items">
              {astronautsList.map((astro) => {
                const assignedShip = spaceTrucks.find((t) => t.id === astro.naveId);
                return (
                  <div key={astro.credentialId} className="astronaut-card">
                    <div className="astronaut-card-header">
                      <span className="astronaut-card-name">{astro.nome}</span>
                      <span className="astronaut-card-id">{astro.credentialId}</span>
                    </div>

                    <div className="astronaut-card-details">
                      <div className="astronaut-card-row">
                        <span className="astronaut-card-label">Cargo:</span>
                        <span className="astronaut-card-value">{astro.cargo || astro.funcao || "N/A"}</span>
                      </div>
                      <div className="astronaut-card-row">
                        <span className="astronaut-card-label">Experiência:</span>
                        <span className="astronaut-card-value">{astro.experienciaAnos || 0} anos</span>
                      </div>
                      <div className="astronaut-card-row">
                        <span className="astronaut-card-label">Nave:</span>
                        {assignedShip ? (
                          <span className="astronaut-card-value ship-assigned">{assignedShip.nome}</span>
                        ) : (
                          <span className="astronaut-card-value reserve">Reserva</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="btn-remove-astro"
                      onClick={() => handleDelete(astro.credentialId, astro.nome, astro.naveId)}
                      title="Descredenciar tripulante"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isPublic ? (
        <span className="back-to-login-btn" onClick={onBack}>
          Voltar para o Console de Login
        </span>
      ) : null}
    </div>
  );
}
