# 🚀 Space Waste — Sistema de Gestão de Detritos Orbitais

> Plataforma de gerenciamento de lixo espacial com frota de **Space Trucks** orbitais,
> cálculo de rotas otimizadas e controle de missões de coleta ao redor da Terra.

---

## 📡 Sobre o Projeto

O **Space Waste** é uma solução para um dos maiores desafios da economia espacial moderna:
o acúmulo de detritos em órbita terrestre. Atualmente existem mais de **27.000 fragmentos
rastreados** em órbita — e milhões de pequenos detritos não rastreados que ameaçam
satélites ativos, estações espaciais e futuras missões.

A solução proposta consiste em uma frota de **Space Trucks** — caminhões de lixo orbitais —
que percorrem rotas otimizadas ao redor da Terra, coletam detritos e os transportam até
estações base para reaproveitamento de materiais ou carbonização controlada.

---

## ✨ Funcionalidades

| Módulo | Operações |
|---|---|
| **Detritos Espaciais** | Cadastro, listagem, busca por ID/status/tipo, atualização, remoção |
| **Space Trucks** | Cadastro, controle de carga/combustível, gestão de tripulantes |
| **Estações Base** | Cadastro de bases orbitais e terrestres, controle de armazenamento |
| **Missões Orbitais** | Planejamento, adição de detritos, rota otimizada, iniciar/concluir/cancelar |
| **Relatórios** | Resumo geral, estatísticas por status/tipo, listagem polimórfica |

---

## 🧱 Arquitetura e Conceitos de POO

O projeto aplica os **4 pilares da Programação Orientada a Objetos** de forma explícita:

### Abstração
```
ObjetoEspacial (abstract)   →  define contrato para todos os objetos do sistema
Coletavel      (interface)  →  contrato de coleta: podeSerColetado(), marcarComoColetado()
```

### Herança
```
ObjetoEspacial
├── Detrito       (extends ObjetoEspacial, implements Coletavel)
├── SpaceTruck    (extends ObjetoEspacial)
└── EstacaoBase   (extends ObjetoEspacial)
```

### Encapsulamento
```
Todos os atributos são private
Acesso controlado via getters e setters públicos
```

### Polimorfismo
```java
// MenuRelatorio.java — chamada polimórfica exibir()
List<ObjetoEspacial> objetos = new ArrayList<>();
objetos.addAll(detritoService.listarTodos());
objetos.addAll(spaceTruckService.listarTodos());
objetos.addAll(estacaoService.listarTodas());

for (ObjetoEspacial obj : objetos) {
    obj.exibir(); // comportamento diferente para cada tipo
}
```

---

## 📁 Estrutura do Projeto

```
java/src/br/com/spacewaste/
│
├── enums/
│   ├── TipoDetrito.java        # 7 tipos de detrito espacial
│   ├── StatusDetrito.java      # Flutuando → Carbonizado
│   ├── TipoDescarte.java       # Reaproveitamento / Carbonização
│   ├── StatusNave.java         # Disponivel / Em Missão / Manutenção
│   └── StatusMissao.java       # Planejada / Em Andamento / Concluída
│
├── model/
│   ├── ObjetoEspacial.java     # Classe ABSTRATA base
│   ├── Coletavel.java          # INTERFACE de coleta
│   ├── Detrito.java            # Detrito orbital (herança + interface)
│   ├── SpaceTruck.java         # Caminhão de lixo orbital (herança)
│   ├── EstacaoBase.java        # Base de recebimento (herança)
│   ├── Missao.java             # Missão de coleta orbital
│   ├── PontoOrbital.java       # Waypoint de rota
│   └── Tripulante.java         # Membro da tripulação
│
├── service/
│   ├── DetritoService.java     # CRUD + filtros de detritos
│   ├── SpaceTruckService.java  # CRUD + gestão de tripulantes
│   ├── EstacaoService.java     # CRUD de estações base
│   ├── MissaoService.java      # Ciclo de vida completo de missões
│   └── RotaService.java        # Algoritmo Nearest Neighbor orbital
│
├── menu/
│   ├── MenuPrincipal.java      # Navegação central
│   ├── MenuDetrito.java        # Menu completo de detritos
│   ├── MenuSpaceTruck.java     # Menu completo de Space Trucks
│   ├── MenuEstacao.java        # Menu de estações base
│   ├── MenuMissao.java         # Menu de missões orbitais
│   └── MenuRelatorio.java      # Relatórios e estatísticas
│
├── util/
│   ├── InputUtil.java          # Leitura segura de entrada do console
│   └── ConsolePrinter.java     # Formatação visual do console
│
└── Main.java                   # Ponto de entrada + dados de demonstração
```

---

## 🛠️ Como Compilar e Executar

### Pré-requisitos
- Java JDK 11 ou superior
- CMD ou Terminal

### Compilar
```cmd
cd "caminho/para/java"
javac -encoding UTF-8 -d out -sourcepath src src\br\com\spacewaste\Main.java
```

### Executar
```cmd
java -cp out br.com.spacewaste.Main
```

### Compilar e executar de uma vez
```cmd
javac -encoding UTF-8 -d out -sourcepath src src\br\com\spacewaste\Main.java && java -cp out br.com.spacewaste.Main
```

---

## 🌍 Dados de Demonstração

O sistema já inicializa com dados reais ao executar:

| Tipo | Exemplos carregados |
|---|---|
| Detritos | Cosmos 1408, Fengyun-1C, Iridium 33, Delta II, SNAP-10A, BREEZE-M, Vanguard 1 |
| Space Trucks | SW-Alpha, SW-Beta, SW-Gamma (operacionais) · SW-Delta (manutenção) |
| Estações | Base Orbital Alpha (LEO), Base de Reentrada BR-1 (Terra), Centro GEO-1 |

---

## 🗺️ Algoritmo de Rota Orbital

O **RotaService** implementa o algoritmo do **Vizinho Mais Próximo (Nearest Neighbor)**
para otimizar a sequência de coleta e minimizar o delta-V total da missão:

1. Inicia pelo detrito de **menor altitude** (mais barato de atingir)
2. A cada passo, vai ao detrito **mais próximo não visitado**
3. A distância orbital considera altitude com **peso dobrado** (mudanças de altitude custam mais combustível que variações de longitude/inclinação)

---

## 🎓 Informações Acadêmicas

| | |
|---|---|
| **Instituição** | FIAP |
| **Curso** | Engenharia de Software |
| **Semestre** | 2º Ano — Turma Fevereiro |
| **Entrega** | Global Solution 2026/1 |
| **Tema** | Economia Espacial |

---

## 📦 Entregas do Projeto

- [x] Sistema Java com POO (console)
- [x] Diagrama de Classes UML (`uml/SpaceWaste_ClassDiagram.puml`)
- [ ] Banco de Dados (script SQL + Diagrama ER)
- [ ] Protótipo Web (HTML + CSS + JS)
- [ ] Vídeo Pitch (3 minutos)
