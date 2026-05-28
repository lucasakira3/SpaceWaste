package br.com.spacewaste.menu;

import br.com.spacewaste.enums.StatusMissao;
import br.com.spacewaste.model.*;
import br.com.spacewaste.service.*;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.List;
import java.util.Scanner;

public class MenuMissao {

    private final MissaoService  missaoService;
    private final DetritoService detritoService;
    private final SpaceTruckService    naveService;
    private final EstacaoService estacaoService;
    private final RotaService    rotaService;
    private final Scanner sc;

    public MenuMissao(MissaoService missaoService, DetritoService detritoService,
                      SpaceTruckService naveService, EstacaoService estacaoService,
                      RotaService rotaService, Scanner sc) {
        this.missaoService  = missaoService;
        this.detritoService = detritoService;
        this.naveService    = naveService;
        this.estacaoService = estacaoService;
        this.rotaService    = rotaService;
        this.sc             = sc;
    }

    public void exibir() {
        int opcao;
        do {
            ConsolePrinter.titulo("GERENCIAMENTO DE MISSÕES ORBITAIS");
            ConsolePrinter.itemMenu(1, "Planejar nova missão");
            ConsolePrinter.itemMenu(2, "Listar todas as missões");
            ConsolePrinter.itemMenu(3, "Buscar missão por ID");
            ConsolePrinter.itemMenu(4, "Filtrar por status");
            ConsolePrinter.itemMenu(5, "Adicionar detrito à missão");
            ConsolePrinter.itemMenu(6, "Remover detrito da missão");
            ConsolePrinter.itemMenu(7, "Calcular rota otimizada");
            ConsolePrinter.itemMenu(8, "Iniciar missão");
            ConsolePrinter.itemMenu(9, "Concluir missão");
            ConsolePrinter.itemMenu(10, "Cancelar missão");
            ConsolePrinter.itemMenu(11, "Excluir missão");
            ConsolePrinter.itemMenu(0, "Voltar");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opção: ", 0, 11);

            switch (opcao) {
                case 1:  planejar();          break;
                case 2:  listarTodas();       break;
                case 3:  buscarPorId();       break;
                case 4:  filtrarStatus();     break;
                case 5:  adicionarDetrito();  break;
                case 6:  removerDetrito();    break;
                case 7:  calcularRota();      break;
                case 8:  iniciar();           break;
                case 9:  concluir();          break;
                case 10: cancelar();          break;
                case 11: excluir();           break;
                case 0: break;
            }
        } while (opcao != 0);
    }

    // ── Planejamento ──────────────────────────────────────────────────────
    private void planejar() {
        ConsolePrinter.secao("PLANEJAR MISSÃO");

        List<SpaceTruck> naves = naveService.listarDisponiveis();
        if (naves.isEmpty()) {
            ConsolePrinter.aviso("Nenhum Space Truck disponivel para missao.");
            InputUtil.pausar(sc); return;
        }
        List<EstacaoBase> estacoes = estacaoService.listarTodas();
        if (estacoes.isEmpty()) {
            ConsolePrinter.aviso("Nenhuma estação base cadastrada.");
            InputUtil.pausar(sc); return;
        }

        String nome = InputUtil.lerString(sc, "  Nome da missão  : ");

        System.out.println("\n  Space Trucks disponiveis:");
        naves.forEach(n -> System.out.println("  " + n));
        int naveId = InputUtil.lerInteiro(sc, "  ID do Space Truck: ");
        SpaceTruck nave = naveService.buscarPorId(naveId);
        if (nave == null || nave.getStatus() != br.com.spacewaste.enums.StatusNave.DISPONIVEL) {
            ConsolePrinter.erro("Space Truck invalido ou nao disponivel."); InputUtil.pausar(sc); return;
        }

        System.out.println("\n  Estações base:");
        estacoes.forEach(e -> System.out.println("  " + e));
        int estId = InputUtil.lerInteiro(sc, "  ID da estação destino: ");
        EstacaoBase estacao = estacaoService.buscarPorId(estId);
        if (estacao == null) {
            ConsolePrinter.erro("Estação não encontrada."); InputUtil.pausar(sc); return;
        }

        Missao m = missaoService.planejar(nome, nave, estacao);
        ConsolePrinter.ok("Missão planejada com ID " + m.getId());
        InputUtil.pausar(sc);
    }

    // ── Listagem ──────────────────────────────────────────────────────────
    private void listarTodas() {
        ConsolePrinter.secao("TODAS AS MISSÕES");
        List<Missao> lista = missaoService.listarTodas();
        if (lista.isEmpty()) ConsolePrinter.vazio();
        else lista.forEach(m -> {
            System.out.printf("  [ID:%-3d] %-25s | %-15s | ST: %-22s | %d detrito(s)%n",
                    m.getId(), m.getNome(), m.getStatus().getDescricao(),
                    m.getNave().getNome(), m.getDetritos().size());
        });
        InputUtil.pausar(sc);
    }

    private void buscarPorId() {
        ConsolePrinter.secao("BUSCAR MISSÃO POR ID");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        Missao m = missaoService.buscarPorId(id);
        if (m == null) ConsolePrinter.erro("Missão não encontrada.");
        else {
            m.exibir();
            if (!m.getDetritos().isEmpty()) {
                System.out.println("\n  Detritos da missão:");
                m.getDetritos().forEach(d -> System.out.println("    " + d));
            }
        }
        InputUtil.pausar(sc);
    }

    private void filtrarStatus() {
        ConsolePrinter.secao("FILTRAR POR STATUS");
        StatusMissao[] statusArr = StatusMissao.values();
        for (int i = 0; i < statusArr.length; i++) ConsolePrinter.itemMenu(i + 1, statusArr[i].getDescricao());
        int opc = InputUtil.lerInteiroMinMax(sc, "  Status: ", 1, statusArr.length);
        List<Missao> lista = missaoService.buscarPorStatus(statusArr[opc - 1]);
        if (lista.isEmpty()) ConsolePrinter.vazio();
        else lista.forEach(m -> System.out.printf("  [ID:%-3d] %-25s | %s%n",
                m.getId(), m.getNome(), m.getStatus().getDescricao()));
        InputUtil.pausar(sc);
    }

    // ── Detritos ──────────────────────────────────────────────────────────
    private void adicionarDetrito() {
        ConsolePrinter.secao("ADICIONAR DETRITO À MISSÃO");
        int missaoId = InputUtil.lerInteiro(sc, "  ID da missão  : ");
        Missao m = missaoService.buscarPorId(missaoId);
        if (m == null) { ConsolePrinter.erro("Missão não encontrada."); InputUtil.pausar(sc); return; }

        System.out.println("\n  Detritos disponíveis para coleta:");
        List<Detrito> coletaveis = detritoService.listarColetaveis();
        if (coletaveis.isEmpty()) {
            ConsolePrinter.info("Nenhum detrito disponível (status FLUTUANDO).");
            InputUtil.pausar(sc); return;
        }
        coletaveis.forEach(d -> System.out.println("  " + d));

        int detId = InputUtil.lerInteiro(sc, "  ID do detrito  : ");
        Detrito d = detritoService.buscarPorId(detId);
        if (d == null) { ConsolePrinter.erro("Detrito não encontrado."); InputUtil.pausar(sc); return; }

        String resultado = missaoService.adicionarDetrito(missaoId, d);
        if (resultado.equals("OK")) ConsolePrinter.ok("Detrito adicionado à missão.");
        else                        ConsolePrinter.erro(resultado);
        InputUtil.pausar(sc);
    }

    private void removerDetrito() {
        ConsolePrinter.secao("REMOVER DETRITO DA MISSÃO");
        int missaoId = InputUtil.lerInteiro(sc, "  ID da missão  : ");
        Missao m = missaoService.buscarPorId(missaoId);
        if (m == null) { ConsolePrinter.erro("Missão não encontrada."); InputUtil.pausar(sc); return; }

        System.out.println("\n  Detritos na missão:");
        m.getDetritos().forEach(d -> System.out.println("  " + d));

        int detId = InputUtil.lerInteiro(sc, "  ID do detrito  : ");
        if (missaoService.removerDetrito(missaoId, detId))
            ConsolePrinter.ok("Detrito removido da missão.");
        else
            ConsolePrinter.erro("Detrito não encontrado na missão.");
        InputUtil.pausar(sc);
    }

    // ── Rota ──────────────────────────────────────────────────────────────
    private void calcularRota() {
        ConsolePrinter.secao("CALCULAR ROTA OTIMIZADA");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        Missao m = missaoService.buscarPorId(id);
        if (m == null) { ConsolePrinter.erro("Missão não encontrada."); InputUtil.pausar(sc); return; }

        List<PontoOrbital> rota = missaoService.calcularRota(id);
        if (rota.isEmpty()) {
            ConsolePrinter.aviso("A missão não possui detritos para calcular rota.");
            InputUtil.pausar(sc); return;
        }

        System.out.println();
        System.out.println("  Rota otimizada (algoritmo: vizinho mais próximo):");
        ConsolePrinter.linha();
        for (int i = 0; i < rota.size(); i++) {
            System.out.printf("  %2d. %s%n", i + 1, rota.get(i));
        }
        ConsolePrinter.linha();
        double distTotal = rotaService.calcularDistanciaTotal(rota);
        System.out.printf("  Distância total estimada: %.2f u.o. (unidades orbitais)%n", distTotal);
        InputUtil.pausar(sc);
    }

    // ── Ciclo de vida ─────────────────────────────────────────────────────
    private void iniciar() {
        ConsolePrinter.secao("INICIAR MISSÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        String resultado = missaoService.iniciar(id);
        if (resultado.equals("OK")) ConsolePrinter.ok("Missão iniciada!");
        else                        ConsolePrinter.erro(resultado);
        InputUtil.pausar(sc);
    }

    private void concluir() {
        ConsolePrinter.secao("CONCLUIR MISSÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        String resultado = missaoService.concluir(id);
        if (resultado.equals("OK")) ConsolePrinter.ok("Missão concluída! Detritos transferidos para a estação base.");
        else                        ConsolePrinter.erro(resultado);
        InputUtil.pausar(sc);
    }

    private void cancelar() {
        ConsolePrinter.secao("CANCELAR MISSÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        String resultado = missaoService.cancelar(id);
        if (resultado.equals("OK")) ConsolePrinter.ok("Missão cancelada.");
        else                        ConsolePrinter.erro(resultado);
        InputUtil.pausar(sc);
    }

    private void excluir() {
        ConsolePrinter.secao("EXCLUIR MISSÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da missão: ");
        String conf = InputUtil.lerString(sc, "  Confirmar exclusão? (S/N): ");
        if (!conf.equalsIgnoreCase("S")) { ConsolePrinter.info("Cancelado."); InputUtil.pausar(sc); return; }
        if (missaoService.remover(id)) ConsolePrinter.ok("Missão excluída.");
        else ConsolePrinter.erro("Não foi possível excluir. Missão não encontrada ou em andamento.");
        InputUtil.pausar(sc);
    }
}
