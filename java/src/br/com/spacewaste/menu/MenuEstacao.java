package br.com.spacewaste.menu;

import br.com.spacewaste.model.Detrito;
import br.com.spacewaste.model.EstacaoBase;
import br.com.spacewaste.service.EstacaoService;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.List;
import java.util.Scanner;

public class MenuEstacao {

    private final EstacaoService service;
    private final Scanner sc;

    public MenuEstacao(EstacaoService service, Scanner sc) {
        this.service = service;
        this.sc      = sc;
    }

    public void exibir() {
        int opcao;
        do {
            ConsolePrinter.titulo("GERENCIAMENTO DE ESTAÇÕES BASE");
            ConsolePrinter.itemMenu(1, "Cadastrar nova estação");
            ConsolePrinter.itemMenu(2, "Listar todas as estações");
            ConsolePrinter.itemMenu(3, "Buscar estação por ID");
            ConsolePrinter.itemMenu(4, "Atualizar dados da estação");
            ConsolePrinter.itemMenu(5, "Ver detritos armazenados");
            ConsolePrinter.itemMenu(6, "Remover estação");
            ConsolePrinter.itemMenu(0, "Voltar");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opção: ", 0, 6);

            switch (opcao) {
                case 1: cadastrar();       break;
                case 2: listarTodas();     break;
                case 3: buscarPorId();     break;
                case 4: atualizar();       break;
                case 5: verDetritos();     break;
                case 6: remover();         break;
                case 0: break;
            }
        } while (opcao != 0);
    }

    private void cadastrar() {
        ConsolePrinter.secao("CADASTRAR ESTAÇÃO BASE");
        String nome = InputUtil.lerString(sc, "  Nome             : ");
        String loc  = InputUtil.lerString(sc, "  Localização      : ");
        double alt  = InputUtil.lerDouble(sc, "  Altitude (km)    : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinação (°)   : ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (°)    : ");
        double cap  = InputUtil.lerDoublePositivo(sc, "  Capacidade (kg)  : ");

        EstacaoBase e = service.cadastrar(nome, alt, incl, lon, loc, cap);
        ConsolePrinter.ok("Estação cadastrada com ID " + e.getId());
        InputUtil.pausar(sc);
    }

    private void listarTodas() {
        ConsolePrinter.secao("TODAS AS ESTAÇÕES");
        List<EstacaoBase> lista = service.listarTodas();
        if (lista.isEmpty()) ConsolePrinter.vazio();
        else lista.forEach(e -> System.out.println("  " + e));
        InputUtil.pausar(sc);
    }

    private void buscarPorId() {
        ConsolePrinter.secao("BUSCAR ESTAÇÃO POR ID");
        int id = InputUtil.lerInteiro(sc, "  ID da estação: ");
        EstacaoBase e = service.buscarPorId(id);
        if (e == null) ConsolePrinter.erro("Estação não encontrada.");
        else           e.exibir();
        InputUtil.pausar(sc);
    }

    private void atualizar() {
        ConsolePrinter.secao("ATUALIZAR ESTAÇÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da estação: ");
        EstacaoBase e = service.buscarPorId(id);
        if (e == null) { ConsolePrinter.erro("Estação não encontrada."); InputUtil.pausar(sc); return; }

        System.out.println("  Atual: " + e);
        String nome = InputUtil.lerString(sc, "  Novo nome         : ");
        String loc  = InputUtil.lerString(sc, "  Localização       : ");
        double alt  = InputUtil.lerDouble(sc, "  Altitude (km)     : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinação (°)    : ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (°)     : ");
        double cap  = InputUtil.lerDoublePositivo(sc, "  Capacidade (kg)   : ");

        service.atualizarDados(id, nome, alt, incl, lon, loc, cap);
        ConsolePrinter.ok("Estação atualizada.");
        InputUtil.pausar(sc);
    }

    private void verDetritos() {
        ConsolePrinter.secao("DETRITOS ARMAZENADOS");
        int id = InputUtil.lerInteiro(sc, "  ID da estação: ");
        EstacaoBase e = service.buscarPorId(id);
        if (e == null) { ConsolePrinter.erro("Estação não encontrada."); InputUtil.pausar(sc); return; }

        System.out.printf("  Estação: %s | Armazenado: %.1f / %.1f kg%n",
                e.getNome(), e.getCargaAtualKg(), e.getCapacidadeArmazenagemKg());
        ConsolePrinter.linha();

        List<Detrito> lista = e.getDetritosArmazenados();
        if (lista.isEmpty()) ConsolePrinter.info("Nenhum detrito armazenado.");
        else lista.forEach(d -> System.out.println("  " + d));
        InputUtil.pausar(sc);
    }

    private void remover() {
        ConsolePrinter.secao("REMOVER ESTAÇÃO");
        int id = InputUtil.lerInteiro(sc, "  ID da estação: ");
        String conf = InputUtil.lerString(sc, "  Confirmar remoção? (S/N): ");
        if (!conf.equalsIgnoreCase("S")) { ConsolePrinter.info("Cancelado."); InputUtil.pausar(sc); return; }
        if (service.remover(id)) ConsolePrinter.ok("Estação removida.");
        else                     ConsolePrinter.erro("Estação não encontrada.");
        InputUtil.pausar(sc);
    }
}
