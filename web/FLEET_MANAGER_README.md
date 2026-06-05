# 🚀 Gerenciador de Frota Espacial - SpaceWaste

## Visão Geral

A tela de **Gerenciador de Frota** permite gerenciar completamente a frota de Space Trucks do projeto SpaceWaste, incluindo:

- Criação e edição de naves
- Configuração de tipo, capacidade e combustível
- Gerenciamento de tripulantes por nave
- Monitoramento de status e carga

## 📍 Acessar a Tela

1. Abra a aplicação SpaceWaste
2. No menu superior, clique em **"Gerenciar Frota"**
3. A tela será carregada com a interface de gerenciamento

## 🛸 Guia de Uso

### Aba 1: Frotas & Naves

#### Criar Nova Nave

1. Clique no botão verde **"+ Nova Nave"**
2. Preencha o formulário:
   - **ID**: Identificador único da nave (ex: 1, 2, 3)
   - **Nome**: Nome da nave (ex: SpaceTruck-01)
   - **Tipo**: Selecione entre:
     - 🚛 **Carga** - Transporte de carga
     - 👥 **Passageiros** - Transporte de pessoas
     - 🔍 **Coleta de Detritos** - Coleta de lixo espacial
     - 📡 **Reconhecimento** - Missões de reconhecimento
     - 🔧 **Utilitária** - Tarefas gerais
   - **Capacidade (kg)**: Peso máximo que pode carregar
   - **Combustível (%)**: Nível inicial de combustível (0-100)
   - **Status**: Estado atual da nave
3. Clique em **"Criar Nave"**

#### Editar uma Nave

1. Selecione a nave na lista à esquerda
2. Clique no botão **"✏️ Editar"**
3. Modifique os campos desejados (ID não pode ser alterado)
4. Clique em **"Atualizar"**

#### Deletar uma Nave

1. Selecione a nave na lista à esquerda
2. Clique no botão **"🗑️ Deletar"**
3. Confirme a ação

#### Visualizar Detalhes

Selecione qualquer nave para ver:

- Informações gerais (ID, Tipo, Capacidade)
- Status atual com indicador colorido
- Barra de progresso de carga
- Barra de progresso de combustível
- Número de tripulantes

### Aba 2: Tripulação

**Requisito**: Selecione uma nave primeiro

#### Adicionar Tripulante

1. Clique na aba **"Tripulação"**
2. Na seção esquerda, preencha:
   - **Nome do Tripulante**: Nome completo (ex: João Silva)
   - **Cargo**: Selecione entre:
     - 🧑‍✈️ **Piloto** - Responsável pela pilotagem
     - 🧑‍✈️ **Co-piloto** - Assistente do piloto
     - 🔧 **Engenheiro** - Manutenção de sistemas
     - 🛠️ **Técnico** - Assistente técnico
     - 🔬 **Cientista** - Pesquisa e análise
     - ⚕️ **Médico** - Cuidados médicos
   - **Anos de Experiência**: Experiência profissional
3. Clique em **"+ Adicionar Tripulante"**

#### Remover Tripulante

1. Na seção direita ("Membros da Tripulação"), localize o tripulante
2. Clique no botão **"✕"** no card do tripulante
3. O tripulante será removido da nave

#### Visualizar Tripulação

- Todos os membros são listados em cards
- Cada card mostra: Nome, Cargo, Anos de Experiência
- O total de membros é exibido no header

## 🎨 Indicadores Visuais

### Status de Naves (Cores)

- 🟢 **Verde (#00ff88)** - Disponível
- 🟡 **Amarelo (#ffaa00)** - Em Missão
- 🔴 **Vermelho (#ff6b6b)** - Retornando
- 🔴 **Vermelho Escuro (#ff0055)** - Manutenção
- ⚫ **Cinza (#555555)** - Desativada

### Barras de Progresso

- **Carga**: Mostra o percentual de ocupação da nave
- **Combustível**: Mostra o nível de combustível (0-100%)

## 💡 Dicas e Truques

1. **Navegação Rápida**: Clique no nome da nave ou na Logo (SpaceWaste) para voltar ao início
2. **Seleção**: Uma nave selecionada fica destacada com borda brilhante
3. **Responsivo**: A interface se adapta a diferentes tamanhos de tela
4. **Validação**: O sistema valida campos obrigatórios antes de criar/adicionar

## 🔄 Integração com Outras Telas

Os dados de naves e tripulantes são compartilhados com:

- **Mapa de Rotas**: Visualizar naves em órbita
- **Painel Operacional**: Monitorar status geral
- **Painel de Lançamento**: Iniciar missões

## ⚙️ Especificações Técnicas

- **Framework**: React 18+
- **Componentização**: SpaceFleetManager
- **Estado**: Gerenciado via props (spaceTrucks, setSpaceTrucks)
- **Estilo**: CSS customizado com tema cyberpunk
- **Responsividade**: Mobile-first, Desktop-optimized

## 🐛 Suporte

Para relatar problemas ou sugestões, consulte o README principal do projeto.
