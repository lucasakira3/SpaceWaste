import React from 'react';

export default function Home({ setCurrentPage }) {
  return (
    <div className="page-container">
      <header className="home-hero">
        <div className="corner-hud corner-top-left"></div>
        <div className="corner-hud corner-top-right"></div>
        <div className="corner-hud corner-bottom-left"></div>
        <div className="corner-hud corner-bottom-right"></div>
        
        <div className="home-title-container">
          <h1 className="home-title">SpaceWaste</h1>
          <div className="home-subtitle">Orbital Waste & Route Optimizer</div>
        </div>
        
        <p className="home-description">
          Uma plataforma tecnológica de ponta projetada para combater a crise silenciosa que ameaça a exploração espacial.
          Mapeamos, rastreamos e calculamos rotas otimizadas para frotas de <strong>Space Trucks</strong> orbitais
          coletarem e processarem detritos ao redor da Terra, prevenindo colisões catastróficas.
        </p>

        {/* Orbit animation simulation */}
        <div className="orbit-simulation">
          <div className="earth-node"></div>
          <div className="orbit-line orbit-1">
            <div className="satellite-dot" title="Space Truck Ativo"></div>
          </div>
          <div className="orbit-line orbit-2">
            <div className="debris-dot" title="Fragmento de Foguete"></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button className="btn-hud" onClick={() => setCurrentPage('map')}>
            <span>Iniciar Mapa de Rotas</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
          <button className="btn-hud-alt" onClick={() => setCurrentPage('dashboard')}>
            <span>Acessar Dashboard Operacional</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </button>
        </div>
      </header>

      <section className="grid-3" style={{ marginBottom: '30px' }}>
        <div className="hud-card">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <h3 style={{ color: 'var(--color-cyan)', marginBottom: '10px' }}>A Ameaça Orbital</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            Atualmente, existem mais de <strong>27.000 detritos catalogados</strong> pela NASA e ESA em órbita terrestre,
            além de milhões de partículas não rastreáveis. Estes projéteis viajam a mais de 28.000 km/h,
            capazes de destruir satélites de comunicações vitais e habitações orbitais como a ISS.
          </p>
        </div>

        <div className="hud-card kessler-card">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <h3 style={{ marginBottom: '10px' }}>A Síndrome de Kessler</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            Se a densidade de lixo no espaço continuar subindo, uma única colisão em cadeia gerará milhões
            de novos estilhaços. Esse efeito dominó tornará órbitas cruciais inutilizáveis por séculos.
            O SpaceWaste foi projetado para interceptar esses objetos antes do ponto de não-retorno.
          </p>
        </div>

        <div className="hud-card">
          <div className="corner-hud corner-top-left"></div>
          <div className="corner-hud corner-top-right"></div>
          <h3 style={{ color: 'var(--color-cyan)', marginBottom: '10px' }}>Algoritmo Delta-V</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            Nosso módulo de rota implementa a heurística <strong>Nearest Neighbor (Vizinho Mais Próximo)</strong>
            para traçar órbitas ideais. Com peso dobrado na altitude (onde mudanças requerem propulsão RCS extrema),
            minimizamos o uso de propelente para maximizar a coleta por veículo espacial.
          </p>
        </div>
      </section>

      {/* ── Seção ODS da ONU ─────────────────────────────────────────────── */}
      <section className="hud-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="corner-hud corner-top-left"></div>
        <div className="corner-hud corner-top-right"></div>
        <div>
          <h3 style={{ color: '#fff', marginBottom: '6px' }}>Objetivos de Desenvolvimento Sustentável — ONU</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            O SpaceWaste está alinhado com a Agenda 2030 da ONU. A limpeza orbital protege infraestrutura global,
            promove economia circular no espaço e garante que as próximas gerações possam usar as órbitas terrestres.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            {
              num: '9',
              color: '#f36d25',
              title: 'Indústria, Inovação e Infraestrutura',
              text: 'Space Trucks e algoritmos de rota orbital representam inovação de ponta em infraestrutura espacial sustentável.',
            },
            {
              num: '12',
              color: '#bf8b2e',
              title: 'Consumo e Produção Responsáveis',
              text: 'Detritos coletados são reaproveitados ou carbonizados de forma controlada — economia circular aplicada ao espaço.',
            },
            {
              num: '13',
              color: '#3f7e44',
              title: 'Ação Contra a Mudança Global do Clima',
              text: 'Reaproveitar material orbital reduz a necessidade de novos lançamentos, diminuindo a emissão de gases durante o processo de produção.',
            },
            {
              num: '17',
              color: '#19486a',
              title: 'Parcerias e Meios de Implementação',
              text: 'Integração com dados da ESA e NASA exemplifica a cooperação internacional necessária para a governança do espaço.',
            },
          ].map(({ num, color, title, text }) => (
            <div
              key={num}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${color}55`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '6px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: color,
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '15px',
                    borderRadius: '6px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {num}
                </span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>{title}</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hud-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="corner-hud corner-top-left"></div>
        <div className="corner-hud corner-top-right"></div>
        <h3 style={{ color: '#fff' }}>Como Funciona a Missão</h3>
        <div className="grid-3" style={{ marginTop: '10px', textAlign: 'left' }}>
          <div>
            <h4 style={{ color: 'var(--color-cyan)', marginBottom: '5px' }}>1. Rastreamento Telemetria</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Importamos vetores orbitais simulados de bancos de dados ESA/NASA. Cada objeto possui altitude, inclinação e longitude precisas.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-cyan)', marginBottom: '5px' }}>2. Planejamento de Rotas</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Selecionamos o Space Truck coletor e enviamos a lista de alvos. Nosso motor gera a ordem otimizada que reduz os custos de delta-V.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-cyan)', marginBottom: '5px' }}>3. Logística e Processamento</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
              O Space Truck armazena o lixo de forma balanceada. Detritos leves vão para a Estação Orbital para reciclagem, pesados são desintegrados na atmosfera.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
