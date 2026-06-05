import React, { useState, useRef, useEffect } from 'react';
import {
  calcularCentroDeMassa,
  consultarChatbot,
  StatusNave,
  StatusDetrito
} from '../services/orbitalService';

// Grade terrestre simplificada para o mini mapa de atracagem
function miniIsLand(lat, lon) {
  if (lat < -60) return true;
  if (lat >= 15 && lat <= 75 && lon >= -170 && lon <= -50) return true;
  if (lat >= -55 && lat < 15 && lon >= -90 && lon <= -30) return true;
  if (lat >= -35 && lat < 37 && lon >= -20 && lon <= 52) return true;
  if (lat >= 10 && lat <= 80 && lon >= -10 && lon <= 180) return lat > 40 || (lat > 20 && lon > 35 && lon < 130);
  if (lat >= -40 && lat <= -10 && lon >= 110 && lon <= 155) return true;
  return false;
}
const miniEarthGrid = [];
for (let lat = -80; lat <= 80; lat += 10) {
  for (let lon = -180; lon <= 180; lon += 10) {
    if (miniIsLand(lat, lon)) miniEarthGrid.push({ lat, lon });
  }
}

export default function Dashboard({ debrisList, setDebrisList, spaceTrucks, setSpaceTrucks }) {
  const [selectedTruckId, setSelectedTruckId] = useState(1);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: "Saudações, Engenheiro. Sou a A.R.I.A., a Inteligência Artificial de monitoramento do SpaceWaste. Como posso auxiliar nas operações orbitais hoje?" }
  ]);

  // Reciclagem orbital
  const [selectedRecyclingId, setSelectedRecyclingId] = useState(null);
  const [totalRecycladoKg, setTotalRecycladoKg] = useState(0);
  const [eventosReciclagem, setEventosReciclagem] = useState([]);
  const miniCanvasRef = useRef(null);
  const miniTimeRef = useRef(0);
  const miniAnimRef = useRef(null);

  // Mini mapa de atracagem
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, earthR = 60;

    const render = () => {
      miniTimeRef.current += 0.012;
      ctx.fillStyle = '#03030c';
      ctx.fillRect(0, 0, W, H);

      // Brilho atmosférico
      const glow = ctx.createRadialGradient(cx, cy, earthR - 10, cx, cy, earthR + 25);
      glow.addColorStop(0, '#001a3d');
      glow.addColorStop(1, 'rgba(0,110,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, earthR + 25, 0, Math.PI * 2); ctx.fill();

      // Terra
      const body = ctx.createRadialGradient(cx - 15, cy - 15, 8, cx, cy, earthR);
      body.addColorStop(0, '#0d255c');
      body.addColorStop(1, '#02030a');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cx, cy, earthR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,240,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();

      // Continentes
      const rot = miniTimeRef.current * 0.04;
      miniEarthGrid.forEach(pt => {
        const lambda = pt.lon * Math.PI / 180 + rot;
        const phi = pt.lat * Math.PI / 180;
        const x3 = earthR * Math.cos(phi) * Math.sin(lambda);
        const y3 = -earthR * Math.sin(phi);
        const z3 = earthR * Math.cos(phi) * Math.cos(lambda);
        if (z3 > 0) {
          const a = 0.15 + 0.6 * (z3 / earthR);
          ctx.fillStyle = `rgba(0,240,255,${a * 0.5})`;
          ctx.fillRect(cx + x3 - 1, cy + y3 - 1, 2, 2);
        }
      });

      // Space Trucks orbitando
      spaceTrucks.forEach((truck, i) => {
        const r = earthR + 18 + (i * 14);
        const speed = 0.07 / (1 + truck.altitudeKm / 2000);
        const angle = miniTimeRef.current * speed + (truck.longitudeGraus * Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle) * 0.55;

        const hasCargo = truck.cargaAtualKg > 0;
        const isSelected = selectedRecyclingId === truck.id;

        // Anel de órbita tracejado
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = isSelected ? 'rgba(255,183,0,0.25)' : 'rgba(0,240,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Halo se selecionado ou com carga
        if (isSelected) {
          ctx.strokeStyle = 'rgba(255,183,0,0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
        } else if (hasCargo) {
          ctx.strokeStyle = 'rgba(0,240,255,0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.stroke();
        }

        // Triângulo Space Truck
        ctx.fillStyle = isSelected ? '#ffb700' : hasCargo ? '#00f0ff' : 'rgba(0,240,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x - 4, y + 4);
        ctx.lineTo(x + 4, y + 4);
        ctx.closePath();
        ctx.fill();

        // Label nome
        ctx.fillStyle = isSelected ? '#ffb700' : 'rgba(255,255,255,0.65)';
        ctx.font = '7px monospace';
        ctx.fillText(truck.nome, x + 7, y + 2);
      });

      miniAnimRef.current = requestAnimationFrame(render);
    };

    render();
    return () => { if (miniAnimRef.current) cancelAnimationFrame(miniAnimRef.current); };
  }, [spaceTrucks, selectedRecyclingId]);

  const handleReciclar = () => {
    const truck = spaceTrucks.find(t => t.id === selectedRecyclingId);
    if (!truck || truck.cargaAtualKg <= 0) return;
    const massa = truck.cargaAtualKg;
    setSpaceTrucks(prev => prev.map(t =>
      t.id === truck.id
        ? { ...t, cargaAtualKg: 0, cargasCompartimentadas: [], status: StatusNave.DISPONIVEL }
        : t
    ));
    setTotalRecycladoKg(prev => prev + massa);
    setEventosReciclagem(prev => [
      { nome: truck.nome, massaKg: massa, hora: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 6));
    setSelectedRecyclingId(null);
  };

  // Obter o Space Truck atualmente selecionado
  const activeTruck = spaceTrucks.find(t => t.id === selectedTruckId) || spaceTrucks[0];

  // Métricas gerais calculadas dinamicamente
  const totalDebris = debrisList.length;
  const floatingDebris = debrisList.filter(d => d.status === StatusDetrito.FLUTUANDO).length;
  const collectedDebris = debrisList.filter(d => d.status === StatusDetrito.COLETADO).length;
  
  // Massa total coletada de detritos
  const totalMassaColetada = debrisList
    .filter(d => d.status === StatusDetrito.COLETADO)
    .reduce((acc, curr) => acc + curr.massaKg, 0);

  // Calcular centro de massa e estabilidade da nave selecionada
  const comStats = calcularCentroDeMassa(activeTruck.cargasCompartimentadas);

  // Manipular mensagens do chatbot
  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(newHistory);
    setChatInput('');

    // Simular delay de processamento
    setTimeout(() => {
      const response = consultarChatbot(query);
      setChatHistory(prev => [...prev, { sender: 'bot', text: response }]);
      
      // Scroll automático para o final do chat
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 450);
  };

  // Heurística de Auto-Balanceamento de Carga
  // Distribui as cargas simetricamente a partir do centro (1.5, 1.5)
  const handleAutoBalance = () => {
    if (activeTruck.cargasCompartimentadas.length === 0) return;

    // Copiar e ordenar as cargas por massa em ordem decrescente
    const sortedCargas = [...activeTruck.cargasCompartimentadas].sort((a, b) => b.massaKg - a.massaKg);
    
    // Coordenadas simétricas em ordem de distância ao centro (1.5, 1.5)
    // As posições centrais são mais balanceadas e devem receber as massas maiores
    const targetPositions = [
      { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 1 }, { r: 2, c: 2 }, // Centro
      { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 0 }, { r: 1, c: 3 }, // Linhas intermediárias
      { r: 2, c: 0 }, { r: 2, c: 3 }, { r: 3, c: 1 }, { r: 3, c: 2 },
      { r: 0, c: 0 }, { r: 0, c: 3 }, { r: 3, c: 0 }, { r: 3, c: 3 }  // Cantos (mais afastados, balanceados por último em oposição)
    ];

    // Mapeamento dos novos grids simétricos para minimizar torque de desvio
    const balancedCargas = [];
    
    // Colocar os elementos
    sortedCargas.forEach((c, idx) => {
      const pos = targetPositions[idx] || { r: 0, c: 0 };
      balancedCargas.push({
        ...c,
        row: pos.r,
        col: pos.c
      });
    });

    // Atualizar estado
    const updatedTrucks = spaceTrucks.map(t => {
      if (t.id === selectedTruckId) {
        return {
          ...t,
          cargasCompartimentadas: balancedCargas
        };
      }
      return t;
    });

    setSpaceTrucks(updatedTrucks);
  };

  // Modificar peso/limpar compartimento manualmente ao clicar
  const handleCellClick = (row, col) => {
    const item = activeTruck.cargasCompartimentadas.find(c => c.row === row && c.col === col);
    
    if (item) {
      // Remover item
      const novasCargas = activeTruck.cargasCompartimentadas.filter(c => !(c.row === row && c.col === col));
      const massaRemovida = item.massaKg;
      
      const updatedTrucks = spaceTrucks.map(t => {
        if (t.id === selectedTruckId) {
          return {
            ...t,
            cargaAtualKg: parseFloat(Math.max(0, t.cargaAtualKg - massaRemovida).toFixed(1)),
            cargasCompartimentadas: novasCargas
          };
        }
        return t;
      });
      setSpaceTrucks(updatedTrucks);
    } else {
      // Perguntar valor para adicionar
      const massaStr = prompt("Adicionar carga simulada (Massa em kg):", "500");
      const massa = parseFloat(massaStr);
      if (isNaN(massa) || massa <= 0) return;

      if (activeTruck.cargaAtualKg + massa > activeTruck.capacidadeMaxKg) {
        alert("Erro: Capacidade máxima da nave seria excedida!");
        return;
      }

      const novasCargas = [
        ...activeTruck.cargasCompartimentadas,
        {
          id: `manual_${Date.now()}`,
          nome: "Detrito Manual",
          row,
          col,
          massaKg: massa
        }
      ];

      const updatedTrucks = spaceTrucks.map(t => {
        if (t.id === selectedTruckId) {
          return {
            ...t,
            cargaAtualKg: parseFloat((t.cargaAtualKg + massa).toFixed(1)),
            cargasCompartimentadas: novasCargas
          };
        }
        return t;
      });
      setSpaceTrucks(updatedTrucks);
    }
  };

  // Gerar dados para os gráficos customizados em SVG
  // Gráfico 1: Risco de Colisão (Síndrome de Kessler) por Altitude
  // Peak at LEO: 700 - 900km
  const kesslerDataPoints = [
    { alt: 200, risk: 2 },
    { alt: 400, risk: 10 },
    { alt: 600, risk: 35 },
    { alt: 800, risk: 95 }, // Pico crítico
    { alt: 1000, risk: 75 },
    { alt: 1200, risk: 45 },
    { alt: 1400, risk: 25 },
    { alt: 2000, risk: 8 },
    { alt: 10000, risk: 3 },
    { alt: 35786, risk: 12 } // Pequeno pico em GEO
  ];

  const svgW = 500;
  const svgH = 150;

  // Converter pontos para string de coordenadas SVG Path
  const makePathData = () => {
    return kesslerDataPoints.map((p, idx) => {
      // Mapeamento linear simples: alt (200 a 36000) -> X (30 a 480)
      // Como GEO é muito longe, usamos escala semi-logarítmica para visualização do gráfico
      const x = 30 + (idx * (svgW - 50) / (kesslerDataPoints.length - 1));
      // risk (0 a 100) -> Y (svgH - 20 a 10)
      const y = (svgH - 20) - (p.risk * (svgH - 30) / 100);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const makeAreaPathData = () => {
    const linePath = makePathData();
    if (!linePath) return '';
    const lastX = 30 + ((kesslerDataPoints.length - 1) * (svgW - 50) / (kesslerDataPoints.length - 1));
    return `${linePath} L ${lastX} ${svgH - 20} L 30 ${svgH - 20} Z`;
  };

  return (
    <div className="page-container">
      <div className="dashboard-grid">
        
        {/* Row 1: Métricas Centrais */}
        <div className="metric-grid">
          <div className="hud-card metric-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <div className="metric-label">Detritos Ativos (Órbita)</div>
            <div className="metric-val magenta">{floatingDebris}</div>
            <div className="metric-desc">Fragmentos flutuantes monitorados</div>
          </div>
          
          <div className="hud-card metric-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <div className="metric-label">Detritos Coletados</div>
            <div className="metric-val green">{collectedDebris}</div>
            <div className="metric-desc">Removidos do cinturão de colisão</div>
          </div>

          <div className="hud-card metric-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <div className="metric-label">Massa Limpa Total</div>
            <div className="metric-val">{totalMassaColetada.toLocaleString()} kg</div>
            <div className="metric-desc">Material incinerado ou reciclado</div>
          </div>

          <div className="hud-card metric-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <div className="metric-label">Frota Space Truck</div>
            <div className="metric-val">
              {spaceTrucks.filter(t => t.status === StatusNave.DISPONIVEL).length}
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                /{spaceTrucks.length} Ativos
              </span>
            </div>
            <div className="metric-desc">Space Trucks operacionais de prontidão</div>
          </div>
        </div>

        {/* Row 2: Tabela de Frota & Análise de Gráficos */}
        <div className="grid-2-1">
          
          {/* Tabela de Space Trucks */}
          <div className="hud-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-cyan)', fontSize: '16px', marginBottom: '15px' }}>
              Gestão da Frota de Coleta (SpaceTrucks)
            </h3>
            
            <div className="table-wrapper">
              <table className="hud-table">
                <thead>
                  <tr>
                    <th>Space Truck</th>
                    <th>Status</th>
                    <th>Altitude</th>
                    <th>Carga Atual</th>
                    <th>Combustível</th>
                    <th>Tripulação</th>
                  </tr>
                </thead>
                <tbody>
                  {spaceTrucks.map(truck => (
                    <tr 
                      key={truck.id} 
                      className={truck.id === selectedTruckId ? 'active' : ''}
                      onClick={() => setSelectedTruckId(truck.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 'bold', color: 'var(--color-cyan)' }}>{truck.nome}</td>
                      <td>
                        <span className={`badge ${
                          truck.status === StatusNave.DISPONIVEL ? 'badge-green' : 
                          truck.status === StatusNave.EM_MISSAO ? 'badge-yellow' : 'badge-magenta'
                        }`}>
                          {truck.status}
                        </span>
                      </td>
                      <td>{truck.altitudeKm > 0 ? `${truck.altitudeKm} km` : 'Hangar'}</td>
                      <td>{truck.cargaAtualKg} kg / {truck.capacidadeMaxKg} kg</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '50px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${truck.combustivelPercent}%`, height: '100%', background: truck.combustivelPercent < 35 ? 'var(--color-magenta)' : 'var(--color-cyan)' }}></div>
                          </div>
                          <span style={{ fontSize: '11px' }}>{truck.combustivelPercent}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {truck.tripulantes.length > 0 ? truck.tripulantes.map(t => t.nome.split(' ')[0]).join(', ') : 'Nenhum'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico de Risco Orbital */}
          <div className="hud-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-magenta)', fontSize: '14px', marginBottom: '10px' }}>
              Densidade de Detritos & Risco de Colisão (Kessler)
            </h3>
            
            <div className="svg-chart-container">
              <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyan-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-magenta)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-magenta)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Linhas de Grade de fundo */}
                <line x1="30" y1="20" x2={svgW - 20} y2="20" className="svg-chart-grid" />
                <line x1="30" y1="55" x2={svgW - 20} y2="55" className="svg-chart-grid" />
                <line x1="30" y1="90" x2={svgW - 20} y2="90" className="svg-chart-grid" />
                <line x1="30" y1="130" x2={svgW - 20} y2="130" className="svg-chart-axis" />
                
                {/* Eixos */}
                <line x1="30" y1="10" x2="30" y2="130" className="svg-chart-axis" />

                {/* Área e Linha */}
                <path d={makeAreaPathData()} className="svg-chart-area" />
                <path d={makePathData()} className="svg-chart-line" style={{ stroke: 'var(--color-magenta)', filter: 'drop-shadow(0 0 4px var(--color-magenta-glow))' }} />
                
                {/* Textos e Rótulos */}
                <text x={svgW / 2} y="15" className="svg-chart-text" textAnchor="middle" style={{ fill: 'var(--color-magenta)' }}>Zona Crítica LEO (700-1000km)</text>
                <text x="10" y="25" className="svg-chart-text">Crit.</text>
                <text x="10" y="130" className="svg-chart-text">Min.</text>
                <text x="35" y="145" className="svg-chart-text">LEO (400k)</text>
                <text x={svgW - 80} y="145" className="svg-chart-text">GEO (36k km)</text>
              </svg>
            </div>
            
            <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
              *O pico crítico representa a órbita síncrona solar, onde detritos de colisões históricas Fengyun-1C e Iridium estão altamente concentrados.
            </p>
          </div>

        </div>

        {/* Row 2.5: Lixo Coletado & Centro de Reciclagem */}
        <div className="grid-2">

          {/* Card: Lixo coletado por Space Truck */}
          <div className="hud-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-cyan)', fontSize: '15px', marginBottom: '4px' }}>
              Lixo Coletado por Space Truck
            </h3>
            {spaceTrucks.map(truck => {
              const pct = truck.capacidadeMaxKg > 0 ? (truck.cargaAtualKg / truck.capacidadeMaxKg) * 100 : 0;
              const barColor = pct > 80 ? '#ff0055' : pct > 50 ? '#ffb700' : '#00f0ff';
              return (
                <div key={truck.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.1)', borderRadius: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#fff' }}>{truck.nome}</span>
                    <span className={`badge ${truck.status === StatusNave.DISPONIVEL ? 'badge-green' : truck.status === StatusNave.EM_MISSAO ? 'badge-yellow' : 'badge-magenta'}`}>
                      {truck.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>
                    <span>Carga: <strong style={{ color: barColor }}>{truck.cargaAtualKg} kg</strong> / {truck.capacidadeMaxKg} kg</span>
                    <span>{truck.cargasCompartimentadas.length} item(s)</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.4s' }} />
                  </div>
                  {truck.cargasCompartimentadas.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {truck.cargasCompartimentadas.slice(0, 5).map((c, i) => (
                        <span key={i} style={{ fontSize: '9px', padding: '2px 5px', background: 'rgba(0,240,255,0.07)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '3px', color: 'var(--color-text-muted)' }}>
                          {c.nome?.split(' ')[0]} — {c.massaKg}kg
                        </span>
                      ))}
                      {truck.cargasCompartimentadas.length > 5 && (
                        <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>+{truck.cargasCompartimentadas.length - 5} mais</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sustentabilidade acumulada */}
            <div style={{ marginTop: '4px', padding: '10px', background: 'rgba(0,255,102,0.04)', border: '1px solid rgba(0,255,102,0.15)', borderRadius: '5px' }}>
              <div style={{ fontSize: '11px', color: '#00ff66', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Impacto de Sustentabilidade
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#00ff66' }}>{totalRecycladoKg.toFixed(0)} kg</div>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>Material reciclado em órbita</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-cyan)' }}>{(totalRecycladoKg * 0.25).toFixed(0)} kg</div>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>CO₂ evitado (estimado)</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-yellow)' }}>{Math.floor(totalRecycladoKg / 500)}</div>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>Lançamentos evitados</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ff7744' }}>{eventosReciclagem.length}</div>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>Missões de reciclagem</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Centro de Reciclagem Orbital — Mini Mapa */}
          <div className="hud-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-green)', fontSize: '15px', marginBottom: '0' }}>
              Centro de Reciclagem Orbital
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
              Selecione um Space Truck no mapa ou na lista para atracar e reciclar a carga coletada.
            </p>

            {/* Mini canvas da Terra */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={miniCanvasRef}
                width={340}
                height={220}
                style={{ borderRadius: '6px', border: '1px solid rgba(0,240,255,0.1)', display: 'block' }}
              />
            </div>

            {/* Seletor de Space Truck */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {spaceTrucks.map(truck => {
                const hasCargo = truck.cargaAtualKg > 0;
                const isSelected = selectedRecyclingId === truck.id;
                return (
                  <div
                    key={truck.id}
                    onClick={() => hasCargo && setSelectedRecyclingId(isSelected ? null : truck.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: isSelected ? '1px solid var(--color-yellow)' : '1px solid rgba(255,255,255,0.07)',
                      background: isSelected ? 'rgba(255,183,0,0.07)' : hasCargo ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                      cursor: hasCargo ? 'pointer' : 'not-allowed',
                      opacity: hasCargo ? 1 : 0.4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: '600', color: isSelected ? 'var(--color-yellow)' : '#fff' }}>
                      {truck.nome}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      {hasCargo ? `${truck.cargaAtualKg} kg a bordo` : 'Sem carga'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Botão de reciclagem */}
            {selectedRecyclingId && (
              <button
                className="btn-hud"
                onClick={handleReciclar}
                style={{ width: '100%', padding: '9px', fontSize: '11px', borderColor: 'var(--color-green)', color: 'var(--color-green)' }}
              >
                Atracar e Reciclar Carga
              </button>
            )}

            {/* Histórico de reciclagem */}
            {eventosReciclagem.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Histórico</div>
                {eventosReciclagem.map((ev, i) => (
                  <div key={i} style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#00ff66' }}>{ev.nome}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{ev.massaKg} kg — {ev.hora}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Row 3: Módulo de Balanceamento de Cargas & Chatbot */}
        <div className="grid-2">
          
          {/* Compartimentação de Cargas */}
          <div className="hud-card">
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: 'var(--color-cyan)', fontSize: '16px' }}>
                Estabilidade e Balanceamento de Carga: {activeTruck.nome}
              </h3>
              <button 
                className="btn-hud" 
                onClick={handleAutoBalance} 
                disabled={activeTruck.status === StatusNave.MANUTENCAO}
                style={{ fontSize: '10px', padding: '6px 12px' }}
              >
                Auto-Balancear Cargas
              </button>
            </div>

            <div className="cargo-module-wrapper">
              
              {/* Painel Gráfico do Grid 4x4 */}
              <div className="cargo-bay-visualizer">
                <div className="cargo-grid-title">BAIA DE CARGA (GRID 4x4)</div>
                
                <div className="cargo-grid-container">
                  {/* Grid 4x4 cells */}
                  {Array.from({ length: 4 }).map((_, rIdx) => 
                    Array.from({ length: 4 }).map((_, cIdx) => {
                      const item = activeTruck.cargasCompartimentadas.find(c => c.row === rIdx && c.col === cIdx);
                      return (
                        <div 
                          key={`${rIdx}-${cIdx}`} 
                          className={`cargo-cell ${item ? 'filled' : ''}`}
                          onClick={() => activeTruck.status !== StatusNave.MANUTENCAO && handleCellClick(rIdx, cIdx)}
                          title={item ? `${item.nome} (${item.massaKg} kg) - Clique para remover` : "Livre - Clique para simular carga"}
                        >
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', position: 'absolute', top: '2px', left: '4px' }}>
                            {rIdx},{cIdx}
                          </span>
                          {item && (
                            <>
                              <span className="cargo-weight-label">{item.massaKg}kg</span>
                              <span className="cargo-item-name">{item.nome}</span>
                            </>
                          )}
                        </div>
                      );
                    })
                  )}

                  {/* Centro de Massa Crosshair Overlay */}
                  {activeTruck.cargasCompartimentadas.length > 0 && (
                    <div 
                      className="center-of-mass-crosshair"
                      style={{ 
                        // Mapear CoM coordenados (0 a 3) para porcentagem do container
                        // Padding interno é 10px, tamanho do cell é 80px, gap é 8px. Total = 344px de grid.
                        // Usar fórmula simplificada: left = padding (10) + CoM * (80 + 8) + 40 (metade do cell)
                        left: `${10 + comStats.x * 88 + 40}px`,
                        top: `${10 + comStats.y * 88 + 40}px`
                      }}
                    >
                      <div className="crosshair-line crosshair-h"></div>
                      <div className="crosshair-line crosshair-v"></div>
                      <div className="crosshair-circle" title="Centro de Massa do Veículo"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ficha de Estabilidade */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#fff', fontSize: '13px', marginBottom: '10px' }}>STATUS DE VOO E RCS</h4>
                
                <div className="telemetry-item">
                  <span className="telemetry-label">Massa Ocupada:</span>
                  <span className="telemetry-value">{activeTruck.cargaAtualKg} kg / {activeTruck.capacidadeMaxKg} kg</span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Centro de Massa (X, Y):</span>
                  <span className="telemetry-value" style={{ color: 'var(--color-cyan)' }}>
                    X: {comStats.x} | Y: {comStats.y}
                  </span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Desvio do Centro Físico (1.5, 1.5):</span>
                  <span className="telemetry-value" style={{ color: comStats.desvio > 0.4 ? 'var(--color-yellow)' : 'var(--color-green)' }}>
                    {comStats.desvio} rad
                  </span>
                </div>

                {/* Banner de estabilidade */}
                <div className={`stability-indicator ${comStats.classeCSS}`}>
                  <div className="stability-header">
                    <span>ESTABILIDADE: {comStats.status}</span>
                    <span>{comStats.desvio < 0.4 ? 'OK' : 'MANOBRA AJUSTE'}</span>
                  </div>
                  <div className="stability-desc">{comStats.descricao}</div>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
                  *Ao adicionar cargas orbitais desequilibradas, o propulsor RCS precisa queimar combustível continuamente para conter o torque giroscópico do Space Truck.
                </p>
              </div>

            </div>
          </div>

          {/* Chatbot A.R.I.A. */}
          <div className="chatbot-container">
            <div className="chatbot-header">
              <div className="bot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="bot-info">
                <span className="bot-name">A.R.I.A. HUD v2.6</span>
                <span className="bot-status">Canal Operacional Conectado</span>
              </div>
            </div>

            {/* Mensagens do chat */}
            <div id="chat-box" className="chat-messages">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Dicas de perguntas rápidas */}
            <div className="chat-quick-hints">
              <button className="quick-hint-btn" onClick={() => handleSendMessage("Qual o status da frota?")}>Status Frota</button>
              <button className="quick-hint-btn" onClick={() => handleSendMessage("O que é a Síndrome de Kessler?")}>Sindrome Kessler</button>
              <button className="quick-hint-btn" onClick={() => handleSendMessage("Como funciona o algoritmo de rota?")}>Algoritmo Rota</button>
              <button className="quick-hint-btn" onClick={() => handleSendMessage("Quais são as estações base?")}>Estações Base</button>
            </div>

            {/* Input de Enviar */}
            <div className="chat-input-area">
              <input 
                type="text" 
                className="hud-input" 
                placeholder="Perguntar sobre detritos, telemetria e missões..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn-hud" onClick={() => handleSendMessage()} style={{ padding: '10px 16px' }}>
                Enviar
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
