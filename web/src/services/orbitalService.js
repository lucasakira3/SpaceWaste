// orbitalService.js - Mock de Dados e Algoritmos de Rota (SpaceWaste)

// Tipos de Detritos Orbitais
export const TipoDetrito = {
  FRAGMENTO_FOGUETE: "Fragmento de Foguete",
  SATELITE_INATIVO: "Satélite Inativo",
  PAINEL_SOLAR: "Painel Solar / Sensores",
  COMPONENTE_ESTRUTURAL: "Componente Estrutural",
  BATERIA_MODULO: "Bateria / Módulo de Energia",
  FRAGMENTO_COLISAO: "Fragmento de Colisão",
  OUTROS: "Outros Detritos"
};

// Status dos Detritos
export const StatusDetrito = {
  FLUTUANDO: "Flutuando",
  COLETADO: "Coletado",
  CARBONIZADO: "Carbonizado"
};

// Status da Nave (Space Truck)
export const StatusNave = {
  DISPONIVEL: "Disponível",
  EM_MISSAO: "Em Missão",
  MANUTENCAO: "Manutenção"
};

// Tipo de Descarte / Destino
export const TipoDescarte = {
  INDEFINIDO: "Indefinido",
  REAPROVEITAMENTO: "Reaproveitamento (Estação Orbital)",
  CARBONIZACAO: "Carbonização Controlada (Reentrada)"
};

// -------------------------------------------------------------------------
// BANCO DE DADOS EM MEMÓRIA (MOCK DE DADOS INICIAIS)
// -------------------------------------------------------------------------

export const initialDebris = [
  { id: 1, nome: "Cosmos 1408 - Frag. 001", altitudeKm: 480.0, inclinacaoGraus: 82.9, longitudeGraus: 45.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 3.5, velocidadeKms: 7.66, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 2, nome: "Fengyun-1C - Satélite", altitudeKm: 855.0, inclinacaoGraus: 98.8, longitudeGraus: 110.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 750.0, velocidadeKms: 7.45, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 3, nome: "Iridium 33 - Painel", altitudeKm: 780.0, inclinacaoGraus: 86.4, longitudeGraus: 60.0, tipoDetrito: TipoDetrito.PAINEL_SOLAR, massaKg: 42.0, velocidadeKms: 7.48, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 4, nome: "Delta II Upper Stage", altitudeKm: 830.0, inclinacaoGraus: 98.7, longitudeGraus: 200.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 1350.0, velocidadeKms: 7.46, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 5, nome: "SNAP-10A Núcleo Reator", altitudeKm: 1307.0, inclinacaoGraus: 90.0, longitudeGraus: 0.0, tipoDetrito: TipoDetrito.BATERIA_MODULO, massaKg: 440.0, velocidadeKms: 7.28, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 6, nome: "BREEZE-M Tanque Auxiliar", altitudeKm: 590.0, inclinacaoGraus: 49.5, longitudeGraus: 175.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 880.0, velocidadeKms: 7.57, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 7, nome: "Vanguard 1 - Corpo Antigo", altitudeKm: 3750.0, inclinacaoGraus: 34.2, longitudeGraus: 90.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 1.47, velocidadeKms: 6.95, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 8, nome: "Cosmos 2251 - Frag. A", altitudeKm: 790.0, inclinacaoGraus: 74.0, longitudeGraus: 230.0, tipoDetrito: TipoDetrito.FRAGMENTO_COLISAO, massaKg: 12.4, velocidadeKms: 7.47, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 9, nome: "Envisat - Instrumento", altitudeKm: 762.0, inclinacaoGraus: 98.5, longitudeGraus: 145.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 210.0, velocidadeKms: 7.49, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 10, nome: "SL-8 R/B Rocket Body", altitudeKm: 950.0, inclinacaoGraus: 83.0, longitudeGraus: 320.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 1400.0, velocidadeKms: 7.39, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 11, nome: "Telstar 401 - Antena", altitudeKm: 35780.0, inclinacaoGraus: 0.1, longitudeGraus: 97.0, tipoDetrito: TipoDetrito.PAINEL_SOLAR, massaKg: 180.0, velocidadeKms: 3.07, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 12, nome: "Pegasus - Parafuso de Coifa", altitudeKm: 610.0, inclinacaoGraus: 23.0, longitudeGraus: 15.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 0.45, velocidadeKms: 7.56, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 13, nome: "OPS 5712 (Transit 14)", altitudeKm: 1010.0, inclinacaoGraus: 90.1, longitudeGraus: 18.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 85.0, velocidadeKms: 7.35, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 14, nome: "Spade - Fragmento de Teste", altitudeKm: 510.0, inclinacaoGraus: 70.0, longitudeGraus: 280.0, tipoDetrito: TipoDetrito.FRAGMENTO_COLISAO, massaKg: 2.1, velocidadeKms: 7.64, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 15, nome: "Skylab Fragment - Grid", altitudeKm: 340.0, inclinacaoGraus: 50.0, longitudeGraus: 340.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 15.0, velocidadeKms: 7.74, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 16, nome: "CZ-4B Rocket Stage", altitudeKm: 730.0, inclinacaoGraus: 98.3, longitudeGraus: 12.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 1100.0, velocidadeKms: 7.51, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 17, nome: "SOLRAD 8 - Satélite", altitudeKm: 890.0, inclinacaoGraus: 59.7, longitudeGraus: 162.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 58.0, velocidadeKms: 7.42, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 18, nome: "Titan IIIC Debris", altitudeKm: 1200.0, inclinacaoGraus: 32.0, longitudeGraus: 88.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 350.0, velocidadeKms: 7.30, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 19, nome: "LAGEOS 1 - Tampa ejetada", altitudeKm: 5860.0, inclinacaoGraus: 109.8, longitudeGraus: 290.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 45.0, velocidadeKms: 5.62, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 20, nome: "ASTRO-H (Hitomi) fragment", altitudeKm: 560.0, inclinacaoGraus: 31.0, longitudeGraus: 215.0, tipoDetrito: TipoDetrito.FRAGMENTO_COLISAO, massaKg: 8.5, velocidadeKms: 7.59, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 21, nome: "Echostar 2 - Sat. Obsoleto", altitudeKm: 35620.0, inclinacaoGraus: 2.5, longitudeGraus: 310.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 1900.0, velocidadeKms: 3.08, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 22, nome: "Ariane 5 - Adaptador", altitudeKm: 650.0, inclinacaoGraus: 6.0, longitudeGraus: 42.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 120.0, velocidadeKms: 7.54, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 23, nome: "Transit 5B-5 - Bateria", altitudeKm: 1040.0, inclinacaoGraus: 90.0, longitudeGraus: 115.0, tipoDetrito: TipoDetrito.BATERIA_MODULO, massaKg: 35.0, velocidadeKms: 7.34, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 24, nome: "H-IIA Foguete Estágio 2", altitudeKm: 810.0, inclinacaoGraus: 98.0, longitudeGraus: 300.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 1500.0, velocidadeKms: 7.47, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 25, nome: "GSTAR 1 - Refletor", altitudeKm: 35790.0, inclinacaoGraus: 0.0, longitudeGraus: 120.0, tipoDetrito: TipoDetrito.PAINEL_SOLAR, massaKg: 24.0, velocidadeKms: 3.07, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 26, nome: "WESTAR 3 - Satélite", altitudeKm: 35780.0, inclinacaoGraus: 1.1, longitudeGraus: 270.0, tipoDetrito: TipoDetrito.SATELITE_INATIVO, massaKg: 980.0, velocidadeKms: 3.07, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 27, nome: "DMSP F11 - Fragmento 4", altitudeKm: 840.0, inclinacaoGraus: 98.9, longitudeGraus: 75.0, tipoDetrito: TipoDetrito.FRAGMENTO_COLISAO, massaKg: 4.8, velocidadeKms: 7.46, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 28, nome: "SECOR 4 - Corpo Metálico", altitudeKm: 1250.0, inclinacaoGraus: 90.3, longitudeGraus: 165.0, tipoDetrito: TipoDetrito.COMPONENTE_ESTRUTURAL, massaKg: 18.0, velocidadeKms: 7.23, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 29, nome: "Thor Burner 2 - Foguete", altitudeKm: 880.0, inclinacaoGraus: 99.1, longitudeGraus: 132.0, tipoDetrito: TipoDetrito.FRAGMENTO_FOGUETE, massaKg: 850.0, velocidadeKms: 7.43, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO },
  { id: 30, nome: "IRAS - Painel de Proteção", altitudeKm: 890.0, inclinacaoGraus: 99.0, longitudeGraus: 52.0, tipoDetrito: TipoDetrito.PAINEL_SOLAR, massaKg: 28.0, velocidadeKms: 7.42, status: StatusDetrito.FLUTUANDO, tipoDescarte: TipoDescarte.INDEFINIDO }
];

export const initialSpaceTrucks = [
  {
    id: 1,
    nome: "SW-Alpha",
    altitudeKm: 450.0,
    inclinacaoGraus: 51.6,
    longitudeGraus: 30.0,
    capacidadeMaxKg: 5000.0,
    cargaAtualKg: 2850.0,
    combustivelPercent: 95.0,
    status: StatusNave.DISPONIVEL,
    tripulantes: [
      { id: 1, nome: "Yuri Petrov", funcao: "Piloto Orbital", experienciaAnos: 12 },
      { id: 2, nome: "Akira Tanaka", funcao: "Eng. de Sistemas", experienciaAnos: 8 },
      { id: 3, nome: "Mia Santos", funcao: "Especialista Coleta", experienciaAnos: 5 }
    ],
    // Grid de Carga 4x4 (pesos distribuídos para simulação do centro de massa)
    // Coordenadas row, col (0 a 3) com massa em kg
    cargasCompartimentadas: [
      { id: "c1", nome: "Cosmos debris", row: 0, col: 0, massaKg: 500 },
      { id: "c2", nome: "Ariane adaptor", row: 0, col: 1, massaKg: 350 },
      { id: "c3", nome: "Instrument mount", row: 1, col: 0, massaKg: 800 },
      { id: "c4", nome: "Solar cell tray", row: 3, col: 3, massaKg: 1200 }
    ]
  },
  {
    id: 2,
    nome: "SW-Beta",
    altitudeKm: 780.0,
    inclinacaoGraus: 86.4,
    longitudeGraus: 120.0,
    capacidadeMaxKg: 8000.0,
    cargaAtualKg: 4200.0,
    combustivelPercent: 72.0,
    status: StatusNave.EM_MISSAO,
    tripulantes: [
      { id: 4, nome: "James O'Brien", funcao: "Piloto Orbital", experienciaAnos: 18 },
      { id: 5, nome: "Layla Hassan", funcao: "Eng. de Propulsão", experienciaAnos: 10 }
    ],
    cargasCompartimentadas: [
      { id: "cb1", nome: "SL-8 Rocket parts", row: 1, col: 1, massaKg: 1400 },
      { id: "cb2", nome: "Breeze auxiliary tank", row: 2, col: 1, massaKg: 1800 },
      { id: "cb3", nome: "Cover panel", row: 2, col: 2, massaKg: 1000 }
    ]
  },
  {
    id: 3,
    nome: "SW-Gamma",
    altitudeKm: 830.0,
    inclinacaoGraus: 98.7,
    longitudeGraus: 200.0,
    capacidadeMaxKg: 6500.0,
    cargaAtualKg: 0.0,
    combustivelPercent: 88.0,
    status: StatusNave.DISPONIVEL,
    tripulantes: [
      { id: 6, nome: "Pedro Alves", funcao: "Piloto Orbital", experienciaAnos: 7 },
      { id: 7, nome: "Nadia Ivanova", funcao: "Cientista Orbital", experienciaAnos: 9 }
    ],
    cargasCompartimentadas: []
  },
  {
    id: 4,
    nome: "SW-Delta",
    altitudeKm: 0.0,
    inclinacaoGraus: 0.0,
    longitudeGraus: 0.0,
    capacidadeMaxKg: 4000.0,
    cargaAtualKg: 0.0,
    combustivelPercent: 15.0,
    status: StatusNave.MANUTENCAO,
    tripulantes: [],
    cargasCompartimentadas: []
  }
];

export const initialStations = [
  { id: 1, nome: "Estação Orbital Alpha", altitudeKm: 400.0, inclinacaoGraus: 51.6, longitudeGraus: 0.0, localizacao: "LEO — Equatorial", capacidadeArmazenagemKg: 120000.0, cargaAtualKg: 34500.0 },
  { id: 2, nome: "Base de Reentrada BR-1", altitudeKm: 0.0, inclinacaoGraus: 0.0, longitudeGraus: -46.6, localizacao: "Terra — São Paulo, SP", capacidadeArmazenagemKg: 500000.0, cargaAtualKg: 128000.0 },
  { id: 3, nome: "Centro de Processamento GEO-1", altitudeKm: 35786.0, inclinacaoGraus: 0.0, longitudeGraus: 0.0, localizacao: "GEO — Ponto Orbital 0°", capacidadeArmazenagemKg: 80000.0, cargaAtualKg: 12400.0 }
];

// -------------------------------------------------------------------------
// ALGORITMO DE DISTÂNCIA E ROTA ORBITAL (Nearest Neighbor)
// Replicado diretamente do RotaService.java e PontoOrbital.java
// -------------------------------------------------------------------------

/**
 * Calcula a distância simplificada entre dois pontos orbitais.
 * A variação de altitude tem peso dobrado, pois mudanças orbitais de altitude
 * exigem consideravelmente mais delta-V (combustível).
 */
export function calcularDistanciaOrbital(p1, p2) {
  const da = (p1.altitudeKm - p2.altitudeKm) * 2.0;
  const di = p1.inclinacaoGraus - p2.inclinacaoGraus;
  const dl = p1.longitudeGraus - p2.longitudeGraus;
  return Math.sqrt(da * da + di * di + dl * dl);
}

/**
 * Calcula a sequência otimizada de pontos de coleta utilizando o algoritmo Nearest Neighbor.
 * Inicia no detrito com a menor altitude e vai para o mais próximo não visitado.
 */
export function calcularRotaOtimizada(detritos) {
  if (!detritos || detritos.length === 0) return [];

  // Filtrar apenas detritos elegíveis (ex: flutuando)
  const candidatos = detritos.map(d => ({
    id: d.id,
    altitudeKm: d.altitudeKm,
    inclinacaoGraus: d.inclinacaoGraus,
    longitudeGraus: d.longitudeGraus,
    referencia: `Detrito-${d.id} / ${d.nome}`,
    nome: d.nome
  }));

  const restantes = [...candidatos];
  const rota = [];

  // Ponto inicial: detrito de menor altitude
  let atualIndex = 0;
  let menorAlt = restantes[0].altitudeKm;
  for (let i = 1; i < restantes.length; i++) {
    if (restantes[i].altitudeKm < menorAlt) {
      menorAlt = restantes[i].altitudeKm;
      atualIndex = i;
    }
  }

  let atual = restantes[atualIndex];
  rota.push(atual);
  restantes.splice(atualIndex, 1);

  while (restantes.length > 0) {
    let proximoIndex = 0;
    let menorDist = Infinity;

    for (let i = 0; i < restantes.length; i++) {
      const dist = calcularDistanciaOrbital(atual, restantes[i]);
      if (dist < menorDist) {
        menorDist = dist;
        proximoIndex = i;
      }
    }

    atual = restantes[proximoIndex];
    rota.push(atual);
    restantes.splice(proximoIndex, 1);
  }

  return rota;
}

/**
 * Calcula a distância orbital total percorrida na rota em unidades arbitrárias de delta-V/distância.
 */
export function calcularDistanciaTotal(rota) {
  let total = 0;
  for (let i = 0; i < rota.length - 1; i++) {
    total += calcularDistanciaOrbital(rota[i], rota[i + 1]);
  }
  return total;
}

// -------------------------------------------------------------------------
// BALANCEAMENTO DE CARGA E ESTABILIDADE
// -------------------------------------------------------------------------

/**
 * Calcula o centro de massa 2D e o nível de estabilidade da baia de carga.
 * Baia de Carga representada como um grid 4x4 (coordenadas x,y de 0 a 3).
 * Centro geométrico ideal é x = 1.5, y = 1.5.
 */
export function calcularCentroDeMassa(cargas) {
  if (!cargas || cargas.length === 0) {
    return {
      x: 1.5,
      y: 1.5,
      desvio: 0,
      status: "Estável",
      descricao: "Baia de carga vazia. Equilíbrio perfeito.",
      classeCSS: "stable"
    };
  }

  let massaTotal = 0;
  let somaX = 0;
  let somaY = 0;

  cargas.forEach(c => {
    massaTotal += c.massaKg;
    somaX += c.col * c.massaKg; // col = eixo X
    somaY += c.row * c.massaKg; // row = eixo Y
  });

  const x_com = somaX / massaTotal;
  const y_com = somaY / massaTotal;

  // Distância euclidiana ao centro geométrico (1.5, 1.5)
  const dx = x_com - 1.5;
  const dy = y_com - 1.5;
  const desvio = Math.sqrt(dx * dx + dy * dy);

  let status = "Estável";
  let descricao = "Cargas bem distribuídas. Centro de massa dentro da margem de segurança.";
  let classeCSS = "stable";

  if (desvio > 0.8) {
    status = "Crítico";
    descricao = "ALERTA: Centro de massa deslocado perigosamente! Risco de falha na estabilização orbital e alto consumo de propulsão RCS.";
    classeCSS = "critical";
  } else if (desvio > 0.4) {
    status = "Advertência";
    descricao = "Distribuição assimétrica. O consumo de combustível de manobra pode aumentar devido ao torque de desvio.";
    classeCSS = "warning";
  }

  return {
    x: parseFloat(x_com.toFixed(2)),
    y: parseFloat(y_com.toFixed(2)),
    desvio: parseFloat(desvio.toFixed(2)),
    status,
    descricao,
    classeCSS
  };
}

// -------------------------------------------------------------------------
// RESPOSTAS DO CHATBOT OPERACIONAL
// -------------------------------------------------------------------------
export const chatbotRespostas = [
  {
    keywords: ["frota", "space truck", "nave", "naves", "trucks", "sw-"],
    resposta: "A frota ativa da SpaceWaste consiste em 4 Space Trucks:\n• **SW-Alpha**: Disponível em LEO (450 km). Pilotos: Yuri Petrov, Akira Tanaka, Mia Santos. Ocupação: 57%.\n• **SW-Beta**: Em Missão de Coleta (780 km). Pilotos: James O'Brien, Layla Hassan. Ocupação: 52.5%.\n• **SW-Gamma**: Disponível em LEO (830 km). Pilotos: Pedro Alves, Nadia Ivanova. Carga: 0%.\n• **SW-Delta**: Em Manutenção nos hangares terrestres."
  },
  {
    keywords: ["kessler", "sindrome de kessler", "síndrome de kessler", "risco", "colisão", "colisoes"],
    resposta: "A **Síndrome de Kessler** é um cenário onde a densidade de objetos na órbita baixa da Terra (LEO) é alta o suficiente para que colisões gerem uma reação em cadeia de novos detritos, tornando a órbita inutilizável para gerações. Nossos algoritmos operam para priorizar detritos com massa elevada (>500kg) em altitudes críticas entre 700km e 900km, minimizando a chance de super-colisões."
  },
  {
    keywords: ["algoritmo", "rota", "nearest neighbor", "vizinho mais proximo", "otimizacao"],
    resposta: "Nosso algoritmo de rota no espaço baseia-se na heurística do **Vizinho Mais Próximo (Nearest Neighbor)**. Ele inicia o plano de voo no detrito de menor altitude orbital e calcula a menor rota subsequente. **A variação de altitude tem peso 2.0 nas equações**, uma vez que alterar o semieixo maior da órbita orbital (altitude) exige delta-V (combustível) exponencialmente maior do que manobras planares."
  },
  {
    keywords: ["nasa", "esa", "tle", "space-track", "dados"],
    resposta: "Os dados exibidos neste painel integram telemetria simulada da rede NASA Space-Track e catálogos da ESA. O sistema processa posições orbitais de forma contínua, estimando altitudes e inclinações com base nas últimas observações astronômicas de radares e sensores ópticos terrestres."
  },
  {
    keywords: ["estacao", "estacoes", "base", "orbital alpha", "br-1"],
    resposta: "Contamos com 3 Estações Base para logística:\n• **Estação Orbital Alpha** (400 km): Base LEO equatorial para desmonte e reciclagem de ligas metálicas leves.\n• **Base de Reentrada BR-1** (Terra - SP): Ponto de reentrada atmosférica controlada para detritos pesados ou não reaproveitáveis.\n• **Centro GEO-1** (35.786 km): Ponto logístico estacionário voltado ao monitoramento e armazenamento temporário de satélites de grande porte desativados."
  },
  {
    keywords: ["ajuda", "comandos", "o que fazer"],
    resposta: "Olá! Sou a **A.R.I.A.**, assistente de bordo operacional da SpaceWaste. Você pode me perguntar sobre:\n• O status da **frota** e tripulação.\n• A **Síndrome de Kessler** e os riscos de colisão.\n• Como funciona o nosso **algoritmo** de rotas.\n• A localização e capacidade das **estações** base.\n• Onde o sistema obtém os **dados** de telemetria."
  }
];

export function consultarChatbot(mensagem) {
  const msgLimpa = mensagem.toLowerCase();
  for (let item of chatbotRespostas) {
    if (item.keywords.some(kw => msgLimpa.includes(kw))) {
      return item.resposta;
    }
  }
  return "Desculpe, não consegui compreender sua solicitação sobre operações de lixo orbital. Digite **'ajuda'** para obter uma lista de tópicos sobre os quais posso responder.";
}
