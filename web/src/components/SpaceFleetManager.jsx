import React, { useState } from "react";
import "../styles/SpaceFleetManager.css";

export default function SpaceFleetManager({ spaceTrucks, setSpaceTrucks }) {
  const [activeTab, setActiveTab] = useState("fleet");
  const [showForm, setShowForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [editingTruck, setEditingTruck] = useState(null);

  // Estado para o formulário de nova nave
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    tipo: "cargo",
    capacidadeMaxKg: 5000,
    combustivelPercent: 100,
    status: "DISPONIVEL",
  });

  // Estado para gerenciar tripulantes
  const [crewData, setCrewData] = useState({
    nome: "",
    cargo: "Piloto",
    experienciaAnos: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacidadeMaxKg" ||
        name === "combustivelPercent" ||
        name === "experienciaAnos"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleCrewInputChange = (e) => {
    const { name, value } = e.target;
    setCrewData((prev) => ({
      ...prev,
      [name]: name === "experienciaAnos" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddTruck = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.id) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (editingTruck) {
      // Editar nave existente
      setSpaceTrucks((prev) =>
        prev.map((truck) =>
          truck.id === editingTruck.id
            ? {
                ...truck,
                ...formData,
                capacidadeMaxKg: parseFloat(formData.capacidadeMaxKg),
                combustivelPercent: parseFloat(formData.combustivelPercent),
              }
            : truck,
        ),
      );
      setEditingTruck(null);
    } else {
      // Adicionar nova nave
      const newTruck = {
        ...formData,
        id: parseInt(formData.id),
        capacidadeMaxKg: parseFloat(formData.capacidadeMaxKg),
        combustivelPercent: parseFloat(formData.combustivelPercent),
        cargaAtualKg: 0,
        tripulantes: [],
      };
      setSpaceTrucks((prev) => [...prev, newTruck]);
    }

    resetForm();
  };

  const handleAddCrew = (e) => {
    e.preventDefault();

    if (!selectedTruck) {
      alert("Selecione uma nave primeiro!");
      return;
    }

    if (!crewData.nome) {
      alert("Digite o nome do tripulante!");
      return;
    }

    const newCrew = {
      id: Date.now(),
      ...crewData,
      experienciaAnos: parseInt(crewData.experienciaAnos),
    };

    setSpaceTrucks((prev) =>
      prev.map((truck) =>
        truck.id === selectedTruck.id
          ? { ...truck, tripulantes: [...(truck.tripulantes || []), newCrew] }
          : truck,
      ),
    );

    // Atualizar selectedTruck
    setSelectedTruck((prev) => ({
      ...prev,
      tripulantes: [...(prev.tripulantes || []), newCrew],
    }));

    setCrewData({ nome: "", cargo: "Piloto", experienciaAnos: 0 });
  };

  const handleDeleteCrew = (truckId, crewId) => {
    setSpaceTrucks((prev) =>
      prev.map((truck) =>
        truck.id === truckId
          ? {
              ...truck,
              tripulantes: truck.tripulantes.filter((c) => c.id !== crewId),
            }
          : truck,
      ),
    );

    if (selectedTruck.id === truckId) {
      setSelectedTruck((prev) => ({
        ...prev,
        tripulantes: prev.tripulantes.filter((c) => c.id !== crewId),
      }));
    }
  };

  const handleSelectTruck = (truck) => {
    setSelectedTruck(truck);
    setShowForm(false);
  };

  const handleEditTruck = (truck) => {
    setFormData({
      id: truck.id,
      nome: truck.nome,
      tipo: truck.tipo || "cargo",
      capacidadeMaxKg: truck.capacidadeMaxKg,
      combustivelPercent: truck.combustivelPercent,
      status: truck.status || "DISPONIVEL",
    });
    setEditingTruck(truck);
    setShowForm(true);
  };

  const handleDeleteTruck = (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta nave?")) {
      setSpaceTrucks((prev) => prev.filter((truck) => truck.id !== id));
      if (selectedTruck?.id === id) {
        setSelectedTruck(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nome: "",
      tipo: "cargo",
      capacidadeMaxKg: 5000,
      combustivelPercent: 100,
      status: "DISPONIVEL",
    });
    setShowForm(false);
    setEditingTruck(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      DISPONIVEL: "#00ff88",
      EM_MISSAO: "#ffaa00",
      RETORNANDO: "#ff6b6b",
      MANUTENCAO: "#ff0055",
      DESATIVADA: "#555555",
    };
    return colors[status] || "#00ff88";
  };

  return (
    <div className="fleet-manager">
      <div className="fleet-header">
        <h1>🚀 Gerenciador de Frota Espacial</h1>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "fleet" ? "active" : ""}`}
            onClick={() => setActiveTab("fleet")}
          >
            Frotas & Naves
          </button>
          <button
            className={`tab-btn ${activeTab === "crew" ? "active" : ""}`}
            onClick={() => setActiveTab("crew")}
            disabled={!selectedTruck}
          >
            Tripulação
          </button>
        </div>
      </div>

      <div className="fleet-content">
        {/* TAB: FLEET */}
        {activeTab === "fleet" && (
          <div className="fleet-tab">
            <div className="fleet-sidebar">
              <button
                className="btn-new-truck"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                + Nova Nave
              </button>

              <div className="truck-list">
                <h3>Naves Disponíveis ({spaceTrucks.length})</h3>
                {spaceTrucks.length === 0 ? (
                  <p className="empty-message">Nenhuma nave cadastrada</p>
                ) : (
                  spaceTrucks.map((truck) => (
                    <div
                      key={truck.id}
                      className={`truck-item ${selectedTruck?.id === truck.id ? "selected" : ""}`}
                      onClick={() => handleSelectTruck(truck)}
                    >
                      <div className="truck-item-header">
                        <span className="truck-name">{truck.nome}</span>
                        <span
                          className="truck-status"
                          style={{ color: getStatusColor(truck.status) }}
                        >
                          ●
                        </span>
                      </div>
                      <div className="truck-info-small">
                        <span>Cap: {truck.capacidadeMaxKg}kg</span>
                        <span>Comb: {truck.combustivelPercent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="fleet-main">
              {showForm ? (
                <div className="form-container">
                  <h2>{editingTruck ? "Editar Nave" : "Nova Nave"}</h2>
                  <form onSubmit={handleAddTruck}>
                    <div className="form-group">
                      <label>ID da Nave *</label>
                      <input
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        disabled={editingTruck}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Nome da Nave *</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Ex: SpaceTruck-01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo de Nave</label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                      >
                        <option value="cargo">Carga</option>
                        <option value="passageiros">Passageiros</option>
                        <option value="coleta">Coleta de Detritos</option>
                        <option value="reconhecimento">Reconhecimento</option>
                        <option value="utilitaria">Utilitária</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Capacidade (kg)</label>
                        <input
                          type="number"
                          name="capacidadeMaxKg"
                          value={formData.capacidadeMaxKg}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Combustível (%)</label>
                        <input
                          type="number"
                          name="combustivelPercent"
                          value={formData.combustivelPercent}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="DISPONIVEL">Disponível</option>
                        <option value="EM_MISSAO">Em Missão</option>
                        <option value="RETORNANDO">Retornando</option>
                        <option value="MANUTENCAO">Manutenção</option>
                        <option value="DESATIVADA">Desativada</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        {editingTruck ? "Atualizar" : "Criar Nave"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={resetForm}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : selectedTruck ? (
                <div className="truck-details">
                  <div className="details-header">
                    <h2>{selectedTruck.nome}</h2>
                    <span
                      className="status-badge"
                      style={{ color: getStatusColor(selectedTruck.status) }}
                    >
                      {selectedTruck.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">ID</span>
                      <span className="value">{selectedTruck.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Tipo</span>
                      <span className="value">
                        {selectedTruck.tipo || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Capacidade</span>
                      <span className="value">
                        {selectedTruck.capacidadeMaxKg} kg
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Carga Atual</span>
                      <span className="value">
                        {selectedTruck.cargaAtualKg || 0} kg (
                        {(
                          ((selectedTruck.cargaAtualKg || 0) /
                            (selectedTruck.capacidadeMaxKg || 1)) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Combustível</span>
                      <span className="value">
                        {selectedTruck.combustivelPercent}%
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Tripulantes</span>
                      <span className="value">
                        {(selectedTruck.tripulantes || []).length}
                      </span>
                    </div>
                  </div>

                  <div className="progress-bars">
                    <div className="progress-item">
                      <label>Carga</label>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${((selectedTruck.cargaAtualKg || 0) / (selectedTruck.capacidadeMaxKg || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-item">
                      <label>Combustível</label>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${selectedTruck.combustivelPercent}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="truck-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditTruck(selectedTruck)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTruck(selectedTruck.id)}
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>👈 Selecione uma nave para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CREW */}
        {activeTab === "crew" && selectedTruck && (
          <div className="crew-tab">
            <div className="crew-header">
              <h2>Tripulação - {selectedTruck.nome}</h2>
              <span className="crew-count">
                {(selectedTruck.tripulantes || []).length} membros
              </span>
            </div>

            <div className="crew-content">
              <div className="crew-form">
                <h3>Adicionar Tripulante</h3>
                <form onSubmit={handleAddCrew}>
                  <div className="form-group">
                    <label>Nome do Tripulante *</label>
                    <input
                      type="text"
                      name="nome"
                      value={crewData.nome}
                      onChange={handleCrewInputChange}
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Cargo</label>
                      <select
                        name="cargo"
                        value={crewData.cargo}
                        onChange={handleCrewInputChange}
                      >
                        <option value="Piloto">Piloto</option>
                        <option value="Co-piloto">Co-piloto</option>
                        <option value="Engenheiro">Engenheiro</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Cientista">Cientista</option>
                        <option value="Médico">Médico</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Anos de Experiência</label>
                      <input
                        type="number"
                        name="experienciaAnos"
                        value={crewData.experienciaAnos}
                        onChange={handleCrewInputChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    + Adicionar Tripulante
                  </button>
                </form>
              </div>

              <div className="crew-list">
                <h3>Membros da Tripulação</h3>
                {(selectedTruck.tripulantes || []).length === 0 ? (
                  <p className="empty-message">Nenhum tripulante cadastrado</p>
                ) : (
                  <div className="crew-items">
                    {selectedTruck.tripulantes.map((crew) => (
                      <div key={crew.id} className="crew-card">
                        <div className="crew-card-header">
                          <h4>{crew.nome}</h4>
                          <button
                            className="btn-remove"
                            onClick={() =>
                              handleDeleteCrew(selectedTruck.id, crew.id)
                            }
                            title="Remover tripulante"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="crew-card-info">
                          <div className="info-row">
                            <span className="label">Cargo:</span>
                            <span className="value">{crew.cargo}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Experiência:</span>
                            <span className="value">
                              {crew.experienciaAnos} anos
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
