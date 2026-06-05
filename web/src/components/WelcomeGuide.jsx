import React, { useState, useEffect } from 'react';

const STEPS = [
  {
    color: '#00f0ff',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="20" stroke="#00f0ff" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="26" cy="26" r="14" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="26" cy="26" r="7" fill="#00f0ff" opacity="0.9"/>
        <circle cx="26" cy="26" r="24" stroke="#00f0ff" strokeWidth="0.5" opacity="0.15"/>
        <line x1="2" y1="26" x2="50" y2="26" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3"/>
        <line x1="26" y1="2" x2="26" y2="50" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3"/>
      </svg>
    ),
    badge: 'Boas-vindas',
    title: 'Bem-vindo ao SpaceWaste',
    desc: 'Você está no Centro de Controle de uma frota de Space Trucks orbitais. A missão: combater a crise silenciosa do lixo espacial, que ameaça satélites ativos e a continuidade da exploração espacial.',
    bullets: null,
    tip: 'Mais de 27.000 detritos catalogados orbitam a Terra agora. Esta plataforma simula o gerenciamento real dessa operação.',
    tipColor: '#00f0ff',
  },
  {
    color: '#00f0ff',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="6" y="8" width="40" height="8" rx="2" stroke="#00f0ff" strokeWidth="1.5" opacity="0.5"/>
        <rect x="6" y="22" width="25" height="22" rx="2" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
        <rect x="35" y="22" width="11" height="10" rx="2" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
        <rect x="35" y="36" width="11" height="8" rx="2" stroke="#00f0ff" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="11" cy="12" r="2" fill="#00f0ff"/>
        <circle cx="19" cy="12" r="2" fill="#00f0ff" opacity="0.5"/>
        <circle cx="27" cy="12" r="2" fill="#00f0ff" opacity="0.3"/>
      </svg>
    ),
    badge: 'Navegação',
    title: 'Estrutura da Plataforma',
    desc: 'A plataforma é dividida em 3 seções acessíveis pela barra de navegação no topo:',
    bullets: [
      'Home — visão geral da missão, contexto e ODS',
      'Mapa de Rotas — globo 3D com detritos e operações de coleta',
      'Painel Operacional — telemetria, gestão de frota e reciclagem',
    ],
    tip: 'Você pode navegar entre as seções a qualquer momento sem perder os dados da missão em andamento.',
    tipColor: '#00f0ff',
  },
  {
    color: '#ff8800',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="10" stroke="#ff8800" strokeWidth="1.5"/>
        <circle cx="26" cy="26" r="18" stroke="#ff8800" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5"/>
        <circle cx="26" cy="26" r="24" stroke="#ff8800" strokeWidth="0.5" strokeDasharray="2 5" opacity="0.3"/>
        <circle cx="44" cy="26" r="3.5" fill="#ff0055"/>
        <circle cx="15" cy="12" r="3" fill="#ff8800" opacity="0.8"/>
        <circle cx="36" cy="38" r="2.5" fill="#ff8800" opacity="0.6"/>
        <circle cx="10" cy="34" r="2" fill="#ff0055" opacity="0.7"/>
      </svg>
    ),
    badge: 'Mapa Orbital',
    title: 'Visualizando os Detritos',
    desc: 'O Mapa de Rotas exibe o globo 3D com todos os objetos rastreados em tempo real:',
    bullets: [
      'Ícones × vermelhos — detritos de alto risco (massa > 400 kg)',
      'Ícones × laranjas — detritos de médio e baixo risco',
      'Triângulos ciano — Space Trucks ativos em órbita',
      'Quadrados verdes — Estações Base de recebimento',
    ],
    tip: 'Clique em qualquer objeto para travar sua telemetria e ver altitude, massa e velocidade no painel lateral.',
    tipColor: '#ff8800',
  },
  {
    color: '#00f0ff',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <polygon points="26,8 38,40 26,34 14,40" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.1)"/>
        <circle cx="26" cy="26" r="20" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3"/>
        <line x1="26" y1="40" x2="26" y2="48" stroke="#00f0ff" strokeWidth="1" opacity="0.5"/>
        <circle cx="26" cy="48" r="2" fill="#00f0ff" opacity="0.5"/>
      </svg>
    ),
    badge: 'Seleção',
    title: 'Selecionando um Space Truck',
    desc: 'No painel lateral direito do Mapa de Rotas, você verá os Space Trucks disponíveis. Cada card exibe:',
    bullets: [
      'Nome e status da aeronave (Disponível / Em Missão / Manutenção)',
      'Carga atual e capacidade máxima em kg',
      'Nível de combustível com barra visual colorida',
    ],
    tip: 'Clique no card do Space Truck desejado para selecioná-lo. Space Trucks em manutenção não podem ser acionados.',
    tipColor: '#00f0ff',
  },
  {
    color: '#ffb700',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="12" cy="26" r="4" fill="#ffb700"/>
        <circle cx="26" cy="14" r="4" fill="#ff8800" opacity="0.8"/>
        <circle cx="40" cy="20" r="4" fill="#ff0055" opacity="0.8"/>
        <circle cx="38" cy="36" r="4" fill="#ff8800" opacity="0.7"/>
        <circle cx="20" cy="40" r="4" fill="#ffb700" opacity="0.8"/>
        <path d="M12 26 L26 14 L40 20 L38 36 L20 40 L12 26" stroke="#ffb700" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.7"/>
        <polygon points="26,14 23,20 29,20" fill="#ffb700" opacity="0.6"/>
      </svg>
    ),
    badge: 'Rota',
    title: 'Traçando a Rota Otimizada',
    desc: 'Com um Space Truck selecionado, o painel lateral avança para o Passo 2:',
    bullets: [
      'O contador mostra quantos detritos flutuantes serão incluídos na rota',
      'Clique em "Calcular Rota Otimizada" para gerar o trajeto',
      'O algoritmo Nearest Neighbor minimiza o custo de combustível (Delta-V)',
      'A rota aparece como uma linha amarela tracejada no mapa',
    ],
    tip: 'Use os filtros de Órbita (LEO / MEO / GEO) para limitar a rota a uma faixa específica antes de calcular.',
    tipColor: '#ffb700',
  },
  {
    color: '#ff0055',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="20" stroke="#ff0055" strokeWidth="1" opacity="0.3"/>
        <polygon points="20,16 20,36 38,26" fill="#ff0055" opacity="0.9"/>
        <circle cx="26" cy="26" r="24" stroke="#ff0055" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.2"/>
        <line x1="6" y1="26" x2="12" y2="26" stroke="#ff0055" strokeWidth="1" opacity="0.5"/>
        <line x1="40" y1="26" x2="46" y2="26" stroke="#ff0055" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    badge: 'Missão',
    title: 'Executando a Coleta',
    desc: 'Após calcular a rota, clique em "Executar Missão" para iniciar a operação de coleta:',
    bullets: [
      'O painel exibe barra de progresso e cronômetro regressivo de 30 segundos',
      'Os detritos somem do mapa um a um conforme são coletados',
      'A linha de rota amarela encolhe junto com a remoção dos alvos',
      'Ao concluir, o status do Space Truck é atualizado para "Em Missão"',
    ],
    tip: 'Use "Resetar Detritos" na barra do mapa a qualquer momento para reiniciar a simulação com todos os detritos de volta.',
    tipColor: '#ff0055',
  },
  {
    color: '#00f0ff',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="8" y="28" width="8" height="16" rx="1" fill="#00f0ff" opacity="0.4"/>
        <rect x="20" y="20" width="8" height="24" rx="1" fill="#00f0ff" opacity="0.6"/>
        <rect x="32" y="12" width="8" height="32" rx="1" fill="#00f0ff" opacity="0.9"/>
        <line x1="6" y1="44" x2="46" y2="44" stroke="#00f0ff" strokeWidth="1" opacity="0.4"/>
        <polyline points="8,22 20,16 32,10 44,6" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
      </svg>
    ),
    badge: 'Dashboard',
    title: 'Painel Operacional',
    desc: 'O Painel Operacional centraliza toda a inteligência da frota:',
    bullets: [
      'Métricas globais: detritos rastreados, coletados, massa total e frota ativa',
      'Tabela da frota com status, altitude, carga e combustível de cada Space Truck',
      'Gráfico de densidade de detritos e risco de Síndrome de Kessler',
      'Módulo de balanceamento de carga com visualização do centro de massa',
      'Chatbot A.R.I.A. para consultas operacionais',
    ],
    tip: 'Clique em uma linha da tabela de Space Trucks para selecionar a nave no módulo de balanceamento.',
    tipColor: '#00f0ff',
  },
  {
    color: '#00ff66',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M26 10 C34 10 40 16 40 24 C40 32 34 38 26 38 C18 38 12 32 12 24" stroke="#00ff66" strokeWidth="2" fill="none"/>
        <path d="M12 24 C12 16 18 10 26 10" stroke="#00ff66" strokeWidth="2" fill="none" strokeDasharray="3 3" opacity="0.5"/>
        <polygon points="12,18 8,26 18,24" fill="#00ff66"/>
        <path d="M20 24 L24 28 L32 20" stroke="#00ff66" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="26" cy="44" r="3" fill="#00ff66" opacity="0.6"/>
        <line x1="26" y1="38" x2="26" y2="41" stroke="#00ff66" strokeWidth="1.5"/>
      </svg>
    ),
    badge: 'Reciclagem',
    title: 'Centro de Reciclagem Orbital',
    desc: 'Após uma missão de coleta, processe os detritos para gerar impacto de sustentabilidade:',
    bullets: [
      'Role o Painel Operacional até a seção "Centro de Reciclagem Orbital"',
      'Visualize o mini globo com os Space Trucks carregados orbitando',
      'Selecione o Space Truck com carga na lista abaixo do mapa',
      'Clique em "Atracar e Reciclar Carga" para processar os detritos',
      'Acompanhe kg reciclados, CO₂ evitado e lançamentos evitados em tempo real',
    ],
    tip: 'Cada kg de material reciclado em órbita evita aproximadamente 250 kg de CO₂ que seria gerado em um novo lançamento.',
    tipColor: '#00ff66',
  },
  {
    color: '#00ff66',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="20" stroke="#00ff66" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="26" cy="26" r="24" stroke="#00ff66" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2"/>
        <path d="M14 26 L22 34 L38 18" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badge: 'Pronto!',
    title: 'Plataforma Pronta para Operação',
    desc: 'Você está pronto para operar o SpaceWaste Control Center. Resumo rápido do fluxo completo:',
    bullets: [
      '1. Acesse o Mapa de Rotas e visualize os detritos em órbita',
      '2. Selecione um Space Truck disponível no painel lateral',
      '3. Calcule a rota otimizada e execute a missão de coleta (30s)',
      '4. Vá ao Painel Operacional para monitorar a frota',
      '5. Recicle a carga coletada no Centro de Reciclagem Orbital',
    ],
    tip: null,
    tipColor: null,
  },
];

const LS_KEY = 'spacewaste_guide_seen_v1';

export default function WelcomeGuide({ onOpenMap }) {
  const [visible, setVisible] = useState(() => !localStorage.getItem(LS_KEY));
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const close = () => {
    localStorage.setItem(LS_KEY, '1');
    setVisible(false);
  };

  const next = () => {
    if (isLast) { close(); return; }
    setStep(s => s + 1);
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(2, 3, 12, 0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: '540px',
        background: 'linear-gradient(145deg, #050d1f, #03060f)',
        border: `1px solid ${current.color}44`,
        borderRadius: '10px',
        boxShadow: `0 0 40px ${current.color}18, 0 20px 60px rgba(0,0,0,0.7)`,
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Cantos HUD */}
        {[
          { top: 0, left: 0, borderTop: `2px solid ${current.color}`, borderLeft: `2px solid ${current.color}` },
          { top: 0, right: 0, borderTop: `2px solid ${current.color}`, borderRight: `2px solid ${current.color}` },
          { bottom: 0, left: 0, borderBottom: `2px solid ${current.color}`, borderLeft: `2px solid ${current.color}` },
          { bottom: 0, right: 0, borderBottom: `2px solid ${current.color}`, borderRight: `2px solid ${current.color}` },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', ...s }} />
        ))}

        {/* Linha de progresso no topo */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, ${current.color}88, ${current.color})`,
            transition: 'width 0.35s ease',
            boxShadow: `0 0 8px ${current.color}`,
          }} />
        </div>

        <div style={{ padding: '28px 32px 24px' }}>

          {/* Header: badge + botão fechar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{
              fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: current.color, padding: '3px 8px',
              border: `1px solid ${current.color}44`, borderRadius: '3px',
              fontFamily: 'monospace',
            }}>
              PASSO {step + 1} / {STEPS.length} — {current.badge}
            </div>
            <button
              onClick={close}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px' }}
              title="Fechar e não mostrar novamente"
            >×</button>
          </div>

          {/* Ícone + Título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
            <div style={{
              width: '70px', height: '70px', flexShrink: 0,
              background: `${current.color}0d`, border: `1px solid ${current.color}33`,
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {current.icon}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', lineHeight: 1.2, marginBottom: '5px' }}>
                {current.title}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                SpaceWaste Control Center
              </div>
            </div>
          </div>

          {/* Descrição */}
          <p style={{ fontSize: '13px', color: '#8a99ad', lineHeight: '1.65', margin: '0 0 14px' }}>
            {current.desc}
          </p>

          {/* Bullets */}
          {current.bullets && (
            <ul style={{ margin: '0 0 14px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {current.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#c0cce0', alignItems: 'flex-start' }}>
                  <span style={{ color: current.color, marginTop: '3px', flexShrink: 0 }}>▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tip */}
          {current.tip && (
            <div style={{
              padding: '10px 14px',
              background: `${current.tipColor}0d`,
              border: `1px solid ${current.tipColor}33`,
              borderLeft: `3px solid ${current.tipColor}`,
              borderRadius: '4px',
              fontSize: '11px', color: '#c0cce0', lineHeight: '1.5',
              marginBottom: '6px',
            }}>
              <span style={{ color: current.tipColor, fontWeight: '700', marginRight: '6px' }}>DICA</span>
              {current.tip}
            </div>
          )}

          {/* Footer: dots + botões */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '22px' }}>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: i === step ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    border: 'none',
                    cursor: 'pointer',
                    background: i === step ? current.color : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.25s',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {step > 0 && (
                <button
                  onClick={prev}
                  style={{
                    padding: '8px 18px', fontSize: '11px', fontWeight: '600',
                    background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.5)', borderRadius: '5px', cursor: 'pointer',
                  }}
                >
                  Anterior
                </button>
              )}
              <button
                onClick={next}
                style={{
                  padding: '8px 22px', fontSize: '11px', fontWeight: '700',
                  background: current.color, border: 'none',
                  color: '#000', borderRadius: '5px', cursor: 'pointer',
                  boxShadow: `0 0 14px ${current.color}66`,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {isLast ? 'Começar Operação' : 'Próximo'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Exporta função para reabrir o guia de fora
export function resetGuide() {
  localStorage.removeItem(LS_KEY);
}
