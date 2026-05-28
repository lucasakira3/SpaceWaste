package br.com.spacewaste.menu;

import br.com.spacewaste.enums.StatusDetrito;
import br.com.spacewaste.enums.TipoDescarte;
import br.com.spacewaste.enums.TipoDetrito;
import br.com.spacewaste.model.Detrito;
import br.com.spacewaste.service.DetritoService;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.List;
import java.util.Scanner;

public class MenuDetrito {

    private final DetritoService service;
    private final Scanner sc;

    public MenuDetrito(DetritoService service, Scanner sc) {
        this.service = service;
        this.sc      = sc;
    }

    public void exibir() {
        int opcao;
        do {
            ConsolePrinter.titulo("GERENCIAMENTO DE DETRITOS ESPACIAIS");
            ConsolePrinter.itemMenu(1, "Cadastrar novo detrito");
            ConsolePrinter.itemMenu(2, "Listar todos os detritos");
            ConsolePrinter.itemMenu(3, "Buscar detrito por ID");
            ConsolePrinter.itemMenu(4, "Filtrar por status");
            ConsolePrinter.itemMenu(5, "Filtrar por tipo");
            ConsolePrinter.itemMenu(6, "Atualizar dados do detrito");
            ConsolePrinter.itemMenu(7, "Atualizar status do detrito");
            ConsolePrinter.itemMenu(8, "Definir tipo de descarte");
            ConsolePrinter.itemMenu(9, "Remover detrito");
            ConsolePrinter.itemMenu(0, "Voltar");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opção: ", 0, 9);

            switch (opcao) {
                case 1: cadastrar();           break;
                case 2: listarTodos();         break;
                case 3: buscarPorId();         break;
                case 4: filtrarPorStatus();    break;
                case 5: filtrarPorTipo();      break;
                case 6: atualizarDados();      break;
                case 7: atualizarStatus();     break;
                case 8: definirDescarte();     break;
                case 9: remover();             break;
                case 0: break;
            }
        } while (opcao != 0);
    }

    // ── Cadastro ──────────────────────────────────────────────────────────
    private void cadastrar() {
        ConsolePrinter.secao("CADASTRAR DETRITO");
        String nome = InputUtil.lerString(sc, "  Nome/Identificação : ");
        double alt  = InputUtil.lerDoublePositivo(sc, "  Altitude (km)      : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinação (°)     : ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (°)      : ");

        System.out.println("\n  Tipos de Detrito:");
        TipoDetrito[] tipos = TipoDetrito.values();
        for (int i = 0; i < tipos.length; i++) {
            ConsolePrinter.itemMenu(i + 1, tipos[i].getDescricao());
        }
        int tOpc = InputUtil.lerInteiroMinMax(sc, "  Tipo: ", 1, tipos.length);
        TipoDetrito tipo = tipos[tOpc - 1];

        double massa = InputUtil.lerDoublePositivo(sc, "  Massa (kg)         : ");
        double vel   = InputUtil.lerDoublePositivo(sc, "  Velocidade (km/s)  : ");

        Detrito d = service.cadastrar(nome, alt, incl, lon, tipo, massa, vel);
        ConsolePrinter.ok("Detrito cadastrado com ID " + d.getId());
        InputUtil.pausar(sc);
    }

    // ── Listagem ──────────────────────────────────────────────────────────
    private void listarTodos() {
        ConsolePrinter.secao("TODOS OS DETRITOS");
        List<Detrito> lista = service.listarTodos();
        if (lista.isEmpty()) { ConsolePrinter.vazio(); }
        else { lista.forEach(d -> System.out.println("  " + d)); }
        InputUtil.pausar(sc);
    }

    // ── Busca por ID ──────────────────────────────────────────────────────
    private void buscarPorId() {
        ConsolePrinter.secao("BUSCAR DETRITO POR ID");
        int id = InputUtil.lerInteiro(sc, "  ID do detrito: ");
        Detrito d = service.buscarPorId(id);
        if (d == null) { ConsolePrinter.erro("Detrito não encontrado."); }
        else           { d.exibir(); }
        InputUtil.pausar(sc);
    }

    // ── Filtros ───────────────────────────────────────────────────────────
    private void filtrarPorStatus() {
        ConsolePrinter.secao("FILTRAR POR STATUS");
        StatusDetrito[] status = StatusDetrito.values();
        for (int i = 0; i < status.length; i++) {
            ConsolePrinter.itemMenu(i + 1, status[i].getDescricao());
        }
        int opc = InputUtil.lerInteiroMinMax(sc, "  Status: ", 1, status.length);
        List<Detrito> lista = service.buscarPorStatus(status[opc - 1]);
        if (lista.isEmpty()) { ConsolePrinter.vazio(); }
        else { lista.forEach(d -> System.out.println("  " + d)); }
        InputUtil.pausar(sc);
    }

    private void filtrarPorTipo() {
        ConsolePrinter.secao("FILTRAR POR TIPO");
        TipoDetrito[] tipos = TipoDetrito.values();
        for (int i = 0; i < tipos.length; i++) {
            ConsolePrinter.itemMenu(i + 1, tipos[i].getDescricao());
        }
        int opc = InputUtil.lerInteiroMinMax(sc, "  Tipo: ", 1, tipos.length);
        List<Detrito> lista = service.buscarPorTipo(tipos[opc - 1]);
        if (lista.isEmpty()) { ConsolePrinter.vazio(); }
        else { lista.forEach(d -> System.out.println("  " + d)); }
        InputUtil.pausar(sc);
    }

    // ── Atualizações ──────────────────────────────────────────────────────
    private void atualizarDados() {
        ConsolePrinter.secao("ATUALIZAR DADOS DO DETRITO");
        int id = InputUtil.lerInteiro(sc, "  ID do detrito: ");
        Detrito d = service.buscarPorId(id);
        if (d == null) { ConsolePrinter.erro("Detrito não encontrado."); InputUtil.pausar(sc); return; }

        System.out.println("  Dados atuais: " + d);
        String nome = InputUtil.lerString(sc, "  Novo nome      : ");
        double alt  = InputUtil.lerDoublePositivo(sc, "  Altitude (km)  : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinação (°) : ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (°)  : ");
        double massa = InputUtil.lerDoublePositivo(sc, "  Massa (kg)     : ");
        double vel   = InputUtil.lerDoublePositivo(sc, "  Velocidade (km/s): ");

        service.atualizarDados(id, nome, alt, incl, lon, massa, vel);
        ConsolePrinter.ok("Detrito atualizado com sucesso.");
        InputUtil.pausar(sc);
    }

    private void atualizarStatus() {
        ConsolePrinter.secao("ATUALIZAR STATUS");
        int id = InputUtil.lerInteiro(sc, "  ID do detrito: ");
        Detrito d = service.buscarPorId(id);
        if (d == null) { ConsolePrinter.erro("Detrito não encontrado."); InputUtil.pausar(sc); return; }

        System.out.println("  Status atual: " + d.getStatusStr());
        StatusDetrito[] lista = StatusDetrito.values();
        for (int i = 0; i < lista.length; i++) ConsolePrinter.itemMenu(i + 1, lista[i].getDescricao());
        int opc = InputUtil.lerInteiroMinMax(sc, "  Novo status: ", 1, lista.length);
        service.atualizarStatus(id, lista[opc - 1]);
        ConsolePrinter.ok("Status atualizado para: " + lista[opc - 1].getDescricao());
        InputUtil.pausar(sc);
    }

    private void definirDescarte() {
        ConsolePrinter.secao("DEFINIR TIPO DE DESCARTE");
        int id = InputUtil.lerInteiro(sc, "  ID do detrito: ");
        Detrito d = service.buscarPorId(id);
        if (d == null) { ConsolePrinter.erro("Detrito não encontrado."); InputUtil.pausar(sc); return; }

        TipoDescarte[] tipos = TipoDescarte.values();
        for (int i = 0; i < tipos.length; i++) ConsolePrinter.itemMenu(i + 1, tipos[i].getDescricao());
        int opc = InputUtil.lerInteiroMinMax(sc, "  Descarte: ", 1, tipos.length);
        service.atualizarDescarte(id, tipos[opc - 1]);
        ConsolePrinter.ok("Tipo de descarte definido: " + tipos[opc - 1].getDescricao());
        InputUtil.pausar(sc);
    }

    // ── Remoção ───────────────────────────────────────────────────────────
    private void remover() {
        ConsolePrinter.secao("REMOVER DETRITO");
        int id = InputUtil.lerInteiro(sc, "  ID do detrito: ");
        String confirmacao = InputUtil.lerString(sc, "  Confirmar remoção? (S/N): ");
        if (!confirmacao.equalsIgnoreCase("S")) { ConsolePrinter.info("Operação cancelada."); InputUtil.pausar(sc); return; }
        if (service.remover(id)) ConsolePrinter.ok("Detrito removido.");
        else                     ConsolePrinter.erro("Detrito não encontrado.");
        InputUtil.pausar(sc);
    }
}
