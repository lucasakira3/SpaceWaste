import React, { useState, useEffect, useRef } from 'react';
import { 
  calcularRotaOtimizada, 
  calcularDistanciaTotal, 
  calcularDistanciaOrbital,
  TipoDetrito, 
  StatusDetrito,
  StatusNave
} from '../services/orbitalService';

// Função para aproximar geograficamente a rotação da Terra 3D com um grid de pontos terrestres
function isLand(lat, lon) {
  // Antártica
  if (lat < -60) return true;
  
  // América do Norte
  if (lat >= 15 && lat <= 75 && lon >= -170 && lon <= -50) {
    if (lat < 50 && lon > -100 && lon < -80) return true; // EUA / México central
    if (lat >= 50) return true; // Canadá
    return lon < -70;
  }
  
  // América do Sul
  if (lat >= -55 && lat < 15 && lon >= -90 && lon <= -30) {
    if (lat < -20) {
      return lon >= -75 && lon <= -45 - (lat + 20) * 0.7;
    }
    return true;
  }
  
  // África
  if (lat >= -35 && lat < 37 && lon >= -20 && lon <= 52) {
    if (lat > 15 && lon < 10) return true;
    if (lat <= 15 && lon >= 10) return true;
    return lat > 10;
  }
  
  // Europa e Ásia (Eurasia)
  if (lat >= 10 && lat <= 80 && lon >= -10 && lon <= 180) {
    if (lat > 40) return true; // Europa central e Rússia
    if (lat <= 40 && lat > 20 && lon > 35 && lon < 130) return true; // Oriente Médio, Índia, China
    if (lat <= 20 && lon > 70 && lon < 130) return true; // Sudeste asiático
    return false;
  }
  
  // Austrália
  if (lat >= -40 && lat <= -10 && lon >= 110 && lon <= 155) {
    return true;
  }
  
  return false;
}

// Pré-gerar a grade terrestre para otimizar a renderização no loop do canvas
const earthGrid = [];
for (let lat = -80; lat <= 80; lat += 7) {
  for (let lon = -180; lon <= 180; lon += 7) {
    if (isLand(lat, lon)) {
      earthGrid.push({ lat, lon });
    }
  }
}

export default function OrbitalMap({ debrisList, setDebrisList, spaceTrucks, setSpaceTrucks }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [activeTruckForRoute, setActiveTruckForRoute] = useState(null);
  const [computedRoute, setComputedRoute] = useState(null);
  const [routeDistance, setRouteDistance] = useState(0);
  const [hoveredObjId, setHoveredObjId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtros
  const [filterOrbit, setFilterOrbit] = useState('ALL'); // ALL, LEO, MEO, GEO
  const [filterType, setFilterType] = useState('ALL');
  const [showStations, setShowStations] = useState(true);
  const [showTrucks, setShowTrucks] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  // Estações base estáticas para renderizar no mapa
  const stations = [
    { id: 101, nome: "Estação Orbital Alpha", altitudeKm: 400.0, inclinacaoGraus: 51.6, longitudeGraus: 0.0, tipo: "Estação Base", localizacao: "LEO" },
    { id: 102, nome: "Base de Reentrada BR-1", altitudeKm: 0.0, inclinacaoGraus: 0.0, longitudeGraus: -46.6, tipo: "Estação Base", localizacao: "Terrestre" },
    { id: 103, nome: "Centro de Processamento GEO-1", altitudeKm: 35786.0, inclinacaoGraus: 0.0, longitudeGraus: 180.0, tipo: "Estação Base", localizacao: "GEO" }
  ];

  // Mapear altitude real para pixels no canvas (Terra agora com 110px de raio para destacar o planeta)
  const mapAltitudeToRadius = (altitude) => {
    const earthRadius = 110; 
    if (altitude <= 2000) {
      // LEO (0 - 2000 km) -> 120 - 170px
      return earthRadius + 10 + (altitude / 2000) * 50;
    } else if (altitude <= 20000) {
      // MEO (2000 - 20000 km) -> 170 - 240px
      return earthRadius + 60 + ((altitude - 2000) / 18000) * 70;
    } else {
      // GEO e acima -> 240 - 290px
      const geoAlt = Math.min(altitude, 36000);
      return earthRadius + 130 + ((geoAlt - 20000) / 16000) * 50;
    }
  };

  const matchesOrbitFilter = (alt) => {
    if (filterOrbit === 'ALL') return true;
    if (filterOrbit === 'LEO') return alt <= 2000;
    if (filterOrbit === 'MEO') return alt > 2000 && alt < 30000;
    if (filterOrbit === 'GEO') return alt >= 30000;
    return true;
  };

  // Render Loop do Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Array para guardar posições 2D calculadas dos objetos para colisão
    let clickableAreas = [];
    
    const render = () => {
      ctx.fillStyle = '#03030c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // Incremento de tempo para órbita e rotação terrestre
      if (isAnimating) {
        timeRef.current += 0.008;
      }
      
      const earthRadius = 110;

      // 1. Renderização da Terra como um Globo Shaded 3D
      // Brilho atmosférico externo azul
      const atmosphereGlow = ctx.createRadialGradient(cx, cy, earthRadius - 20, cx, cy, earthRadius + 35);
      atmosphereGlow.addColorStop(0, '#001a3d');
      atmosphereGlow.addColorStop(0.7, 'rgba(0, 110, 255, 0.25)');
      atmosphereGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius + 35, 0, Math.PI * 2);
      ctx.fill();

      // Esfera Sombreada da Terra
      const earthBody = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, earthRadius);
      earthBody.addColorStop(0, '#0d255c');
      earthBody.addColorStop(0.7, '#050c21');
      earthBody.addColorStop(1, '#02030a');
      ctx.fillStyle = earthBody;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Contorno da Terra
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Desenhar Continentes em 3D Rotativos (Projeção Ortográfica)
      const rotAngle = timeRef.current * 0.05; // Velocidade de rotação do planeta
      
      earthGrid.forEach(pt => {
        // Obter latitude e longitude ajustadas pela rotação terrestre
        const lambda = pt.lon * Math.PI / 180 + rotAngle;
        const phi = pt.lat * Math.PI / 180;
        
        // Coordenadas 3D cartesianas da esfera
        const x3d = earthRadius * Math.cos(phi) * Math.sin(lambda);
        const y3d = -earthRadius * Math.sin(phi); // Eixo Y invertido no Canvas
        const z3d = earthRadius * Math.cos(phi) * Math.cos(lambda); // Profundidade (Z)
        
        // Se z3d > 0, o ponto está na face visível (frente) da Terra
        if (z3d > 0) {
          // Intensidade do ponto baseada na profundidade (efeito 3D curvo)
          const alpha = 0.2 + 0.8 * (z3d / earthRadius);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.5})`;
          ctx.fillRect(cx + x3d - 1, cy + y3d - 1, 2, 2);
        }
      });

      // Grade HUD Estática sobre a Terra
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let r = 20; r < earthRadius; r += 25) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Anéis orbitais HUD
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1.5;
      
      // Anel LEO
      ctx.beginPath();
      ctx.arc(cx, cy, mapAltitudeToRadius(1000), 0, Math.PI * 2);
      ctx.stroke();
      
      // Anel GEO
      ctx.beginPath();
      ctx.arc(cx, cy, mapAltitudeToRadius(35786), 0, Math.PI * 2);
      ctx.stroke();

      // Varredura de radar (Radar Sweep)
      const sweepAngle = (timeRef.current * 0.3) % (Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 300 * Math.cos(sweepAngle), cy + 300 * Math.sin(sweepAngle));
      ctx.stroke();

      // Limpar coordenadas físicas de clique desta iteração
      clickableAreas = [];

      // Função utilitária para projetar e desenhar órbitas em 3D
      const getObjectProjectedCoords = (obj) => {
        const radius = mapAltitudeToRadius(obj.altitudeKm);
        const angle = (timeRef.current * (0.05 / (obj.altitudeKm / 1000 + 1))) + (obj.longitudeGraus * Math.PI / 180);
        const cosIncl = Math.cos(obj.inclinacaoGraus * Math.PI / 180);
        const sinIncl = Math.sin(obj.inclinacaoGraus * Math.PI / 180);
        
        // Coordenadas orbitais 3D simplificadas
        const x3d = radius * Math.cos(angle);
        const yVal = radius * Math.sin(angle);
        const y3d = yVal * cosIncl;
        const z3d = yVal * sinIncl; // Profundidade orbital
        
        const x = cx + x3d;
        const y = cy + y3d;
        
        // Determinar se está escondido atrás do corpo 3D do planeta
        const dist2d = Math.sqrt(x3d*x3d + y3d*y3d);
        const isBehindPlanet = z3d < 0 && dist2d < (earthRadius - 3);

        return { x, y, isBehindPlanet };
      };

      // 3. Renderizar Rota de Coleta (Se ativa)
      if (computedRoute && computedRoute.length > 0) {
        ctx.strokeStyle = 'rgba(255, 183, 0, 0.55)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();

        const truck = spaceTrucks.find(t => t.id === activeTruckForRoute);
        if (truck) {
          const { x: tx, y: ty } = getObjectProjectedCoords(truck);
          ctx.moveTo(tx, ty);

          computedRoute.forEach((pt) => {
            const { x: ptx, y: pty } = getObjectProjectedCoords(pt);
            ctx.lineTo(ptx, pty);
          });
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // 4. Desenhar Estações Base (Verdes)
      if (showStations) {
        stations.forEach(station => {
          const { x, y, isBehindPlanet } = getObjectProjectedCoords(station);
          const opacity = isBehindPlanet ? 0.2 : 1.0;

          // Seletor de cores verdes
          ctx.fillStyle = `rgba(0, 255, 102, ${opacity})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
          ctx.lineWidth = 1;
          
          ctx.fillRect(x - 5, y - 5, 10, 10);
          ctx.strokeRect(x - 5, y - 5, 10, 10);
          
          // Efeito de pulso concêntrico de destaque
          const isSelected = selectedObj && selectedObj.id === station.id;
          const isHovered = hoveredObjId === station.id;
          
          if (isSelected || isHovered) {
            ctx.strokeStyle = `rgba(0, 255, 102, ${isBehindPlanet ? 0.2 : 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 12 + (Math.sin(timeRef.current * 6) * 3), 0, Math.PI * 2);
            ctx.stroke();
          }

          // Nome da base
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.75})`;
          ctx.font = '9px Inter';
          ctx.fillText(station.nome, x + 8, y + 3);

          clickableAreas.push({
            id: station.id,
            x,
            y,
            radius: 15, // Hitbox generosa de clique
            data: station,
            isBehindPlanet
          });
        });
      }

      // 5. Desenhar Space Trucks (Triângulos Ciano)
      if (showTrucks) {
        spaceTrucks.forEach(truck => {
          if (truck.status === StatusNave.MANUTENCAO) return;

          const { x, y, isBehindPlanet } = getObjectProjectedCoords(truck);
          const opacity = isBehindPlanet ? 0.2 : 1.0;

          // Desenhar símbolo de triângulo
          ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          ctx.moveTo(x, y - 7);
          ctx.lineTo(x - 6, y + 6);
          ctx.lineTo(x + 6, y + 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Destaque Pulsante para mostrar que é Clicável
          ctx.strokeStyle = `rgba(0, 240, 255, ${isBehindPlanet ? 0.1 : 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Halo dinâmico senoidal
          ctx.arc(x, y, 10 + (Math.sin(timeRef.current * 7) * 3), 0, Math.PI * 2);
          ctx.stroke();

          // Target reticle se hover ou selecionado
          const isSelected = selectedObj && selectedObj.id === truck.id && selectedObj.tripulantes;
          const isHovered = hoveredObjId === truck.id;

          if (isSelected || isHovered) {
            drawTargetReticle(ctx, x, y, isSelected ? 'var(--color-cyan)' : 'rgba(0,240,255,0.6)');
          }

          // Nome do caminhão
          ctx.fillStyle = `rgba(0, 240, 255, ${opacity * 0.8})`;
          ctx.font = '9px Orbitron';
          ctx.fillText(truck.nome, x + 8, y - 4);

          clickableAreas.push({
            id: truck.id,
            x,
            y,
            radius: 15,
            data: truck,
            isBehindPlanet
          });
        });
      }

      // 6. Desenhar Detritos (Vermelhos / Laranjas)
      debrisList.forEach(deb => {
        if (!matchesOrbitFilter(deb.altitudeKm)) return;
        if (filterType !== 'ALL' && deb.tipoDetrito !== filterType) return;
        if (deb.status === StatusDetrito.COLETADO || deb.status === StatusDetrito.CARBONIZADO) return;

        const { x, y, isBehindPlanet } = getObjectProjectedCoords(deb);
        const opacity = isBehindPlanet ? 0.25 : 1.0;

        const isHighRisk = deb.massaKg > 400 || (deb.altitudeKm > 700 && deb.altitudeKm < 900);
        ctx.fillStyle = isHighRisk ? `rgba(255, 0, 85, ${opacity})` : `rgba(255, 140, 0, ${opacity})`;
        
        const dotSize = Math.max(3.5, Math.min(8, 3.5 + (deb.massaKg / 450)));
        
        // Ponto de detrito
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Pulsar do detrito (Pulsing Halo para destacar pontos clicáveis!)
        ctx.strokeStyle = isHighRisk ? `rgba(255, 0, 85, ${opacity * 0.3})` : `rgba(255, 140, 0, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, dotSize + 4 + Math.sin(timeRef.current * 9) * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Target reticle se selecionado ou hover
        const isSelected = selectedObj && selectedObj.id === deb.id && selectedObj.tipoDetrito;
        const isHovered = hoveredObjId === deb.id;

        if (isSelected || isHovered) {
          drawTargetReticle(ctx, x, y, isSelected ? 'var(--color-magenta)' : 'rgba(255,0,85,0.6)');
          
          if (isSelected) {
            ctx.fillStyle = 'var(--color-magenta)';
            ctx.font = '10px Orbitron';
            ctx.fillText(`ALVO ID:${deb.id} - ${deb.nome}`, x + dotSize + 7, y - 4);
          }
        }

        clickableAreas.push({
          id: deb.id,
          x,
          y,
          radius: 15, // Hitbox ampliada para clique fácil em elementos em movimento
          data: deb,
          isBehindPlanet
        });
      });

      // Configurar eventos de mouse na tela (Hover & Click)
      canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let foundId = null;
        for (let area of clickableAreas) {
          if (area.isBehindPlanet) continue; // Ignorar hovers na face oculta
          const dist = Math.sqrt((mouseX - area.x) * (mouseX - area.x) + (mouseY - area.y) * (mouseY - area.y));
          if (dist <= area.radius) {
            foundId = area.id;
            break;
          }
        }
        
        // Mudar cursor para apontador se houver elemento interativo próximo
        if (foundId) {
          canvas.style.cursor = 'pointer';
          setHoveredObjId(foundId);
        } else {
          canvas.style.cursor = 'default';
          setHoveredObjId(null);
        }
      };

      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let clickedObj = null;
        for (let area of clickableAreas) {
          if (area.isBehindPlanet) continue;
          const dist = Math.sqrt((mouseX - area.x) * (mouseX - area.x) + (mouseY - area.y) * (mouseY - area.y));
          if (dist <= area.radius) {
            clickedObj = area.data;
            break;
          }
        }
        
        if (clickedObj) {
          setSelectedObj(clickedObj);
        } else {
          setSelectedObj(null);
        }
      };

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [debrisList, spaceTrucks, filterOrbit, filterType, showStations, showTrucks, isAnimating, selectedObj, computedRoute, activeTruckForRoute, hoveredObjId]);

  // Função para desenhar brackets de HUD ao redor do alvo
  const drawTargetReticle = (ctx, x, y, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 5); ctx.lineTo(x - 9, y - 9); ctx.lineTo(x - 5, y - 9);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 9); ctx.lineTo(x + 9, y - 9); ctx.lineTo(x + 9, y - 5);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 5); ctx.lineTo(x - 9, y + 9); ctx.lineTo(x - 5, y + 9);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 9); ctx.lineTo(x + 9, y + 9); ctx.lineTo(x + 9, y + 5);
    ctx.stroke();
  };

  const handleCalculateRoute = (truckId) => {
    const eligibleDebris = debrisList.filter(d => 
      d.status === StatusDetrito.FLUTUANDO && 
      matchesOrbitFilter(d.altitudeKm) && 
      (filterType === 'ALL' || d.tipoDetrito === filterType)
    );

    if (eligibleDebris.length === 0) {
      alert("Não há detritos flutuantes nesta órbita/filtros selecionados para traçar rota.");
      return;
    }

    const route = calcularRotaOtimizada(eligibleDebris);
    const dist = calcularDistanciaTotal(route);

    setComputedRoute(route);
    setRouteDistance(dist);
    setActiveTruckForRoute(truckId);
  };

  const handleExecuteCollection = () => {
    if (!computedRoute || !activeTruckForRoute) return;

    const routeIds = computedRoute.map(r => r.id);
    const updatedDebris = debrisList.map(d => {
      if (routeIds.includes(d.id)) {
        return { ...d, status: StatusDetrito.COLETADO, tipoDescarte: TipoDescarte.REAPROVEITAMENTO };
      }
      return d;
    });

    const totalMassaColetada = computedRoute.reduce((acc, curr) => {
      const orig = debrisList.find(d => d.id === curr.id);
      return acc + (orig ? orig.massaKg : 0);
    }, 0);

    const updatedTrucks = spaceTrucks.map(t => {
      if (t.id === activeTruckForRoute) {
        const novaCarga = Math.min(t.capacidadeMaxKg, t.cargaAtualKg + totalMassaColetada);
        const novoComb = Math.max(5, t.combustivelPercent - Math.round(routeDistance / 30));
        
        const novasCargas = [...t.cargasCompartimentadas];
        computedRoute.forEach((cr) => {
          const cellId = `c_new_${cr.id}`;
          const ocupados = novasCargas.map(c => `${c.row},${c.col}`);
          let vagaAchada = false;
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (!ocupados.includes(`${r},${c}`) && !vagaAchada) {
                novasCargas.push({
                  id: cellId,
                  nome: cr.nome,
                  row: r,
                  col: c,
                  massaKg: debrisList.find(d => d.id === cr.id).massaKg
                });
                vagaAchada = true;
              }
            }
          }
        });

        return {
          ...t,
          cargaAtualKg: parseFloat(novaCarga.toFixed(1)),
          combustivelPercent: novoComb,
          status: StatusNave.EM_MISSAO,
          cargasCompartimentadas: novasCargas
        };
      }
      return t;
    });

    setDebrisList(updatedDebris);
    setSpaceTrucks(updatedTrucks);
    setComputedRoute(null);
    setActiveTruckForRoute(null);
    setSelectedObj(null);
    alert("Missão enviada com sucesso! Os Space Trucks interceptaram os detritos orbitais e atualizaram o armazenamento local.");
  };

  // Filtragem da lista para o menu rápido lateral
  const filteredListForSidebar = debrisList.filter(d => 
    d.status === StatusDetrito.FLUTUANDO &&
    d.nome.toLowerCase().includes(searchQuery.toLowerCase()) &&
    matchesOrbitFilter(d.altitudeKm) &&
    (filterType === 'ALL' || d.tipoDetrito === filterType)
  );

  return (
    <div className="page-container">
      <div className="map-layout">
        
        {/* Painel do Mapa Canvas */}
        <div className="map-main-panel">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <div className="corner-hud corner-bottom-left"></div>
          <div className="corner-hud corner-bottom-right"></div>

          <div className="canvas-container">
            <canvas 
              ref={canvasRef} 
              width="900" 
              height="648" 
              className="map-canvas"
            />
            
            <div className="map-overlay-hud">
              <h4>GLOBO DE CONTROLE 3D (SpaceWaste)</h4>
              <div>Sinal Telemetria: NASA Space-Track</div>
              <div>Estação Terrestre: BR-1 São Paulo</div>
              <div>Rotação Terrestre: <span style={{ color: 'var(--color-green)' }}>Ativa</span></div>
              <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>
                *Aponte para ver alvo | Clique para travar telemetria.
              </div>
            </div>

            {/* Painel de Controles e Filtros Rápidos */}
            <div className="map-controls">
              <span style={{ fontSize: '10px', color: 'var(--color-cyan)', fontWeight: 'bold', fontFamily: 'var(--font-hud)' }}>ÓRBITA:</span>
              <button className={`map-control-btn ${filterOrbit === 'ALL' ? 'active' : ''}`} onClick={() => { setFilterOrbit('ALL'); setComputedRoute(null); }}>Todos</button>
              <button className={`map-control-btn ${filterOrbit === 'LEO' ? 'active' : ''}`} onClick={() => { setFilterOrbit('LEO'); setComputedRoute(null); }}>LEO</button>
              <button className={`map-control-btn ${filterOrbit === 'MEO' ? 'active' : ''}`} onClick={() => { setFilterOrbit('MEO'); setComputedRoute(null); }}>MEO</button>
              <button className={`map-control-btn ${filterOrbit === 'GEO' ? 'active' : ''}`} onClick={() => { setFilterOrbit('GEO'); setComputedRoute(null); }}>GEO</button>
              
              <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.2)' }} />
              
              <button className="map-control-btn" onClick={() => setIsAnimating(!isAnimating)}>
                {isAnimating ? "Congelar Órbitas" : "Simular Órbitas"}
              </button>
            </div>

            {/* Legenda */}
            <div className="legend-box">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#ff0055' }}></div>
                <span>Detrito Alto Risco (&gt;400kg)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#ff7700' }}></div>
                <span>Detrito Médio/Baixo Risco</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#00f0ff', borderRadius: '0' }}></div>
                <span>Space Truck (Nave)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#00ff66', borderRadius: '0' }}></div>
                <span>Estações Bases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Lateral de Informações HUD */}
        <div className="map-details-sidebar">
          
          {/* Ficha Técnica / Telemetria */}
          <div className="hud-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-cyan)', fontSize: '15px', marginBottom: '10px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '6px' }}>
              Telemetria Travada
            </h3>

            {selectedObj ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span className={`badge ${
                    selectedObj.tripulantes ? 'badge-cyan' : selectedObj.localizacao ? 'badge-green' : 'badge-magenta'
                  }`}>
                    {selectedObj.tripulantes ? 'Space Truck' : selectedObj.localizacao ? 'Estação' : 'Detrito'}
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '12px' }}>ID: {selectedObj.id}</span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Nome:</span>
                  <span className="telemetry-value" style={{ color: 'var(--color-cyan)' }}>{selectedObj.nome}</span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Altitude:</span>
                  <span className="telemetry-value">{selectedObj.altitudeKm.toLocaleString()} km</span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Inclinação:</span>
                  <span className="telemetry-value">{selectedObj.inclinacaoGraus}°</span>
                </div>

                <div className="telemetry-item">
                  <span className="telemetry-label">Longitude:</span>
                  <span className="telemetry-value">{selectedObj.longitudeGraus}°</span>
                </div>

                {selectedObj.tipoDetrito && (
                  <>
                    <div className="telemetry-item">
                      <span className="telemetry-label">Tipo:</span>
                      <span className="telemetry-value">{selectedObj.tipoDetrito}</span>
                    </div>
                    <div className="telemetry-item">
                      <span className="telemetry-label">Massa:</span>
                      <span className="telemetry-value">{selectedObj.massaKg} kg</span>
                    </div>
                    <div className="telemetry-item">
                      <span className="telemetry-label">Velocidade:</span>
                      <span className="telemetry-value">{selectedObj.velocidadeKms} km/s</span>
                    </div>
                  </>
                )}

                {selectedObj.tripulantes && (
                  <>
                    <div className="telemetry-item">
                      <span className="telemetry-label">Carga:</span>
                      <span className="telemetry-value">{selectedObj.cargaAtualKg} kg / {selectedObj.capacidadeMaxKg} kg</span>
                    </div>
                    <div className="telemetry-item">
                      <span className="telemetry-label">Combustível:</span>
                      <span className="telemetry-value" style={{ color: 'var(--color-green)' }}>{selectedObj.combustivelPercent}%</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', textAlign: 'center', margin: 'auto 0', lineHeight: '1.4' }}>
                Clique em um objeto em órbita ou selecione na lista abaixo para travar a telemetria do radar.
              </div>
            )}
          </div>

          {/* Otimizador de Rotas Orbital */}
          <div className="hud-card" style={{ flexShrink: 0 }}>
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-cyan)', fontSize: '13px', marginBottom: '8px' }}>
              Traçar Rota de Coleta
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {spaceTrucks.filter(t => t.status !== StatusNave.MANUTENCAO).map(t => (
                <button 
                  key={t.id}
                  className={`btn-hud-alt ${activeTruckForRoute === t.id ? 'active' : ''}`}
                  onClick={() => handleCalculateRoute(t.id)}
                  style={{ width: '100%', fontSize: '10px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{t.nome}</span> 
                  <span style={{ color: 'var(--color-cyan)' }}>Calcular Rota</span>
                </button>
              ))}
            </div>

            {computedRoute && (
              <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,183,0,0.05)', border: '1px solid rgba(255,183,0,0.2)', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-yellow)', marginBottom: '3px' }}>
                  Rota Calculada ({computedRoute.length} pontos)
                </div>
                <div style={{ fontSize: '10px', borderTop: '1px solid rgba(255,183,0,0.1)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Custo Delta-V:</span>
                  <strong style={{ color: 'var(--color-cyan)' }}>{routeDistance.toFixed(1)} uD</strong>
                </div>
                <button 
                  className="btn-hud" 
                  onClick={handleExecuteCollection}
                  style={{ width: '100%', marginTop: '6px', fontSize: '10px', padding: '6px 0', borderColor: 'var(--color-yellow)', color: 'var(--color-yellow)' }}
                >
                  Enviar Nave e Iniciar Coleta
                </button>
              </div>
            )}
          </div>

          {/* Novo painel: Lista de Detritos para Clique Simples */}
          <div className="hud-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="corner-hud corner-top-left"></div>
            <div className="corner-hud corner-top-right"></div>
            <h3 style={{ color: 'var(--color-cyan)', fontSize: '13px', marginBottom: '8px' }}>
              Lista de Detritos Rastreados
            </h3>
            
            <input 
              type="text" 
              className="hud-input" 
              placeholder="Buscar detrito..." 
              style={{ padding: '6px 10px', fontSize: '11px', marginBottom: '10px', width: '100%' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredListForSidebar.map(d => (
                <div 
                  key={d.id}
                  className={`telemetry-item`}
                  onClick={() => setSelectedObj(d)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '6px 8px', 
                    borderRadius: '3px',
                    background: selectedObj && selectedObj.id === d.id ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: selectedObj && selectedObj.id === d.id ? '1px solid var(--color-cyan)' : '1px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px'
                  }}
                >
                  <span style={{ fontWeight: '600', color: d.massaKg > 400 ? 'var(--color-magenta)' : '#fff' }}>
                    {d.nome}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{d.altitudeKm} km</span>
                </div>
              ))}
              {filteredListForSidebar.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '11px', padding: '15px' }}>
                  Nenhum detrito encontrado.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
