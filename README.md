# 🚀 Space Waste — Sistema de Gestão e Otimização de Detritos Orbitais

> Plataforma integrada de gerenciamento de lixo espacial com frota de **Space Trucks** orbitais, cálculo matemático de rotas de menor delta-V, simulação física de estabilidade de carga e interface com HUD temático e globo terrestre 3D.

---

## 📡 Sobre o Projeto

O **Space Waste** é uma solução de ponta para combater o acúmulo perigoso de detritos ao redor da Terra. Atualmente, existem mais de **27.000 fragmentos de grande porte rastreados** e milhões de pequenas partículas não catalogadas em órbita baixa (LEO). Viajando a mais de 28.000 km/h, esses objetos ameaçam satélites de comunicação ativos, telescópios e habitações humanas espaciais (como a Estação Espacial Internacional - ISS).

A solução consiste em coordenar uma frota de **Space Trucks** (caminhões de coleta espacial) que percorrem rotas calculadas via algoritmos inteligentes, recolhem os fragmentos orbitais e os transportam para estações de descarte seguro:
1. **Reaproveitamento/Reciclagem**: Realizado na Estação Orbital LEO para reaproveitar ligas metálicas leves.
2. **Carbonização Controlada**: Reentrada atmosférica guiada sobre áreas seguras da Terra (incineração por atrito).

---

## 🧱 Arquitetura e Estrutura do Sistema

O projeto é dividido em duas frentes complementares: um motor lógico robusto desenvolvido sob conceitos rígidos de **Programação Orientada a Objetos (POO) em Java** e uma **interface web responsiva de alta fidelidade desenvolvida em React**.

```
spacewaste/
│
├── java/                      # Sistema CLI Java (Motor Lógico)
│   ├── src/br/com/spacewaste/
│   │   ├── enums/             # Definição de estados e enuns do domínio
│   │   ├── model/             # Entidades abstratas, interfaces e modelos
│   │   ├── service/           # CRUDs e algoritmos orbitais
│   │   ├── menu/              # Interface de linha de comando CLI
│   │   └── Main.java          # Entrada e injeção de dependências do console
│
├── web/                       # Interface Front-End (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes (Map, Dashboard, Login, Cadastros, etc.)
│   │   ├── services/          # Mock de dados NASA/ESA e algoritmos JS
│   │   ├── styles/            # Folhas de estilo modularizadas (Login, Cadastros, Frota)
│   │   ├── App.jsx            # Roteador simples, gerenciamento de estado e controle de acesso
│   │   ├── index.css          # Design System HUD Espacial e Dark Mode
│   │   └── App.css            # Estilos, animações e retículos HUD específicos
│   ├── index.html             # Estrutura base HTML5 com tags SEO
│   └── package.json           # Dependências React e Vite
│
└── README.md                  # Este arquivo explicativo do repositório
```

---

## ⚙️ Motor Lógico em Java (Console CLI)

A base lógica em Java implementa as regras operacionais sob os quatro pilares fundamentais da POO:

*   **Abstração**: Contrato geral implementado pela classe abstrata `ObjetoEspacial` e pela interface `Coletavel`.
*   **Herança**: `Detrito` (herda de `ObjetoEspacial` e implementa `Coletavel`), `SpaceTruck` e `EstacaoBase` estendem a classe base.
*   **Encapsulamento**: Atributos privados protegidos com validações específicas de acesso público via *Getters e Setters*.
*   **Polimorfismo**: Execuções dinâmicas como o método `exibir()` que assume comportamentos distintos para cada classe filha nas listagens de relatórios.

### Algoritmo de Rota Orbital (Nearest Neighbor)
O `RotaService` implementa a heurística do **Vizinho Mais Próximo** para traçar a ordem ideal de coleta, minimizando o Delta-V (gasto de propulsão). **A altitude tem peso dobrado nas equações**, pois a mudança de eixos orbitais (subir ou descer altitudes) consome significativamente mais propelente RCS do que correções planares.

---

## 💻 Protótipo Web (React Front-End)

A interface web simula uma sala de controle espacial futurista baseada em micro-animações, sombras de neon ciano/magenta e recursos de interatividade:

### 1. Painel de Lançamento (Home)
*   **Apresentação HUD**: Efeito de brilho de néon e wireframes estilizados.
*   **Animação Orbital**: Órbitas 2D interativas geradas puramente via animações CSS `keyframes`, demonstrando o comportamento orbital da frota e do lixo ao redor da Terra.
*   **Ficha do Problema**: Análises visuais explicativas sobre a **Síndrome de Kessler** e os vetores logísticos de mitigação.

### 2. Globo Terrestre e Mapa Orbital 3D
*   **Globo 3D Interativo**: A Terra é simulada como uma esfera tridimensional em rotação contínua desenhada no **HTML5 Canvas**. Uma grade de pontos geográficos calcula em 3D as posições dos continentes usando projeção ortográfica.
*   **Oclusão Orbital**: Satélites e naves orbitam em 3D. Quando se deslocam para trás do planeta (face oculta $Z < 0$), o sistema atenua a opacidade para $20\%$ de forma realista.
*   **Mira HUD de Telemetria**:
    *   **Halos Pulsantes**: Círculos pulsantes avisam o usuário de forma clara que as naves, bases e detritos em órbita são clicáveis.
    *   **Mira HUD**: Ao passar o cursor (que se transforma em `pointer`), brackets de mira HUD militar travam no alvo detectado.
    *   **Hitbox de 15px**: Margem de clique ampliada para facilitar a captura de detritos móveis de alta velocidade.
*   **Lista de Busca Lateral**: Permite filtrar e buscar detritos diretamente em um painel HUD lateral. Clicar em um item da lista foca a mira e a telemetria nele de forma instantânea.
*   **Simulador de Voo**: Selecione um Space Truck, calcule a rota mais curta passando pelos alvos da órbita selecionada, e visualize o trajeto traçado no globo. O botão **Enviar Coleta** efetua a interceptação e transfere a massa dos detritos para a nave na simulação local.

### 3. Painel Operacional (Dashboard)
*   **Métricas Dinâmicas**: Contadores automáticos de detritos ativos no cinto de colisão, lixo recolhido e total de massa espacial incinerada ou reciclada ($kg$).
*   **Módulo Estabilidade e Carga (Grid 4x4)**:
    *   Representação física dos 16 compartimentos da baia de carga dos Space Trucks.
    *   Cálculo em tempo real do **Centro de Massa (CoM)** com base nas posições e pesos das toneladas de lixo armazenado.
    *   **Indicador de Voo**: Alertas dinâmicos de estabilidade giroscópica (*Estável* em verde, *Advertência* em amarelo, *Crítico* piscando em vermelho devido a torque de desvio).
    *   **Auto-Balanceamento Heurístico**: Um algoritmo que reorganiza as cargas de forma simétrica a partir do centro da nave, estabilizando e realinhando o Centro de Massa automaticamente.
    *   Permite adicionar ou remover massas arbitrariamente clicando nas células do grid.
*   **Gráficos Customizados SVG**: Análise de risco de densidade orbital gerada nativamente em SVG com gradientes e áreas sombreadas neon, sem arrastar dependências pesadas.
*   **Chatbot A.R.I.A.**: Assistente operacional dotada de inteligência artificial de bordo com base em processamento de palavras-chave, fornecendo telemetria da frota, explicações da Síndrome de Kessler e instruções gerais.

### 4. Controle de Acesso e Cadastros (Novo)
*   **Autenticação HUD Futurista**: Painel de login holográfico com simulação interativa de **Scanner Biométrico** (leitor de digital com linha de escaneamento a laser ciano/verde). Integração de credenciais ativas e novos cadastros sincronizados via `localStorage`.
*   **Recrutamento de Astronautas**: Tela completa para recrutamento de tripulação orbital, com campos de Nome, Cargo (Piloto, Engenheiro, etc.), Experiência Espacial e Senha de Acesso. Permite alocar imediatamente o astronauta a um Space Truck da frota ou mantê-lo em reserva.
*   **Estaleiro de Manufatura de Naves**: Módulo avançado para registro de novos Space Trucks. Permite definir serial ID, nome, tipo de chassi (Carga, Passageiros, Coleta, etc.), capacidade de peso e nível inicial de combustível. O envio do formulário dispara um processo simulado de manufatura 3D no hangar orbital e exibe a planta baixa (blueprint) da nave desenhada em SVG.

---

## 🚀 Como Executar as Aplicações

### Executando o Motor Java (CLI)
1. Certifique-se de possuir o Java JDK 11 ou superior instalado.
2. Acesse a pasta do projeto java:
   ```cmd
   cd java
   ```
3. Compile e execute o ponto de entrada:
   ```cmd
   javac -encoding UTF-8 -d out -sourcepath src src\br\com\spacewaste\Main.java && java -cp out br.com.spacewaste.Main
   ```

### Executando a Interface Web (React)
1. Certifique-se de possuir o Node.js instalado (v16+ recomendado).
2. Acesse o diretório da web:
   ```cmd
   cd web
   ```
3. Instale as dependências:
   ```cmd
   npm install
   ```
4. Inicie o servidor local de desenvolvimento (Vite):
   ```cmd
   npm run dev
   ```
5. Abra a URL fornecida pelo Vite no navegador (geralmente `http://localhost:5173/`).

---

## 🎓 Informações Acadêmicas

| Campo | Descrição |
|---|---|
| **Instituição** | FIAP |
| **Curso** | Engenharia de Software |
| **Semestre** | 2º Ano — Turma Fevereiro |
| **Entrega** | Global Solution 2026/1 — Economia Espacial |
| **Equipe / Assinatura** | **Code Crew 2026** |
