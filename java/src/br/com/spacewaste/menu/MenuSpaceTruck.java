package br.com.spacewaste.menu;

import br.com.spacewaste.enums.StatusNave;
import br.com.spacewaste.model.SpaceTruck;
import br.com.spacewaste.model.Tripulante;
import br.com.spacewaste.service.SpaceTruckService;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.List;
import java.util.Scanner;

public class MenuSpaceTruck {

    private final SpaceTruckService service;
    private final Scanner sc;

    public MenuSpaceTruck(SpaceTruckService service, Scanner sc) {
        this.service = service;
        this.sc      = sc;
    }

    public void exibir() {
        int opcao;
        do {
            ConsolePrinter.titulo("GERENCIAMENTO DE SPACE TRUCKS");
            ConsolePrinter.itemMenu(1, "Cadastrar novo Space Truck");
            ConsolePrinter.itemMenu(2, "Listar todos os Space Trucks");
            ConsolePrinter.itemMenu(3, "Buscar Space Truck por ID");
            ConsolePrinter.itemMenu(4, "Listar Space Trucks disponiveis");
            ConsolePrinter.itemMenu(5, "Filtrar por status");
            ConsolePrinter.itemMenu(6, "Atualizar dados do Space Truck");
            ConsolePrinter.itemMenu(7, "Gerenciar tripulantes");
            ConsolePrinter.itemMenu(8, "Remover Space Truck");
            ConsolePrinter.itemMenu(0, "Voltar");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opcao: ", 0, 8);

            switch (opcao) {
                case 1: cadastrar();         break;
                case 2: listarTodos();       break;
                case 3: buscarPorId();       break;
                case 4: listarDisponiveis(); break;
                case 5: filtrarStatus();     break;
                case 6: atualizar();         break;
                case 7: menuTripulantes();   break;
                case 8: remover();           break;
                case 0: break;
            }
        } while (opcao != 0);
    }

    private void cadastrar() {
        ConsolePrinter.secao("CADASTRAR SPACE TRUCK");
        String nome = InputUtil.lerString(sc, "  Nome do Space Truck : ");
        double alt  = InputUtil.lerDoublePositivo(sc, "  Altitude (km)       : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinacao (graus)  : ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (graus)   : ");
        double cap  = InputUtil.lerDoublePositivo(sc, "  Capacidade (kg)     : ");
        double comb = InputUtil.lerInteiroMinMax(sc, "  Combustivel (%)     : ", 1, 100);

        SpaceTruck t = service.cadastrar(nome, alt, incl, lon, cap, comb);
        ConsolePrinter.ok("Space Truck cadastrado com ID " + t.getId());
        InputUtil.pausar(sc);
    }

    private void listarTodos() {
        ConsolePrinter.secao("TODOS OS SPACE TRUCKS");
        List<SpaceTruck> lista = service.listarTodos();
        if (lista.isEmpty()) ConsolePrinter.vazio();
        else lista.forEach(t -> System.out.println("  " + t));
        InputUtil.pausar(sc);
    }

    private void buscarPorId() {
        ConsolePrinter.secao("BUSCAR SPACE TRUCK POR ID");
        int id = InputUtil.lerInteiro(sc, "  ID do Space Truck: ");
        SpaceTruck t = service.buscarPorId(id);
        if (t == null) ConsolePrinter.erro("Space Truck nao encontrado.");
        else           t.exibir();
        InputUtil.pausar(sc);
    }

    private void listarDisponiveis() {
        ConsolePrinter.secao("SPACE TRUCKS DISPONIVEIS");
        List<SpaceTruck> lista = service.listarDisponiveis();
        if (lista.isEmpty()) ConsolePrinter.info("Nenhum Space Truck disponivel no momento.");
        else lista.forEach(t -> System.out.println("  " + t));
        InputUtil.pausar(sc);
    }

    private void filtrarStatus() {
        ConsolePrinter.secao("FILTRAR POR STATUS");
        StatusNave[] statusArr = StatusNave.values();
        for (int i = 0; i < statusArr.length; i++) ConsolePrinter.itemMenu(i + 1, statusArr[i].getDescricao());
        int opc = InputUtil.lerInteiroMinMax(sc, "  Status: ", 1, statusArr.length);
        List<SpaceTruck> lista = service.buscarPorStatus(statusArr[opc - 1]);
        if (lista.isEmpty()) ConsolePrinter.vazio();
        else lista.forEach(t -> System.out.println("  " + t));
        InputUtil.pausar(sc);
    }

    private void atualizar() {
        ConsolePrinter.secao("ATUALIZAR SPACE TRUCK");
        int id = InputUtil.lerInteiro(sc, "  ID do Space Truck: ");
        SpaceTruck t = service.buscarPorId(id);
        if (t == null) { ConsolePrinter.erro("Space Truck nao encontrado."); InputUtil.pausar(sc); return; }

        System.out.println("  Dados atuais: " + t);
        String nome = InputUtil.lerString(sc, "  Novo nome         : ");
        double alt  = InputUtil.lerDoublePositivo(sc, "  Altitude (km)     : ");
        double incl = InputUtil.lerDouble(sc, "  Inclinacao (graus): ");
        double lon  = InputUtil.lerDouble(sc, "  Longitude (graus) : ");
        double cap  = InputUtil.lerDoublePositivo(sc, "  Capacidade (kg)   : ");
        double comb = InputUtil.lerInteiroMinMax(sc, "  Combustivel (%)   : ", 1, 100);

        service.atualizarDados(id, nome, alt, incl, lon, cap, comb);
        ConsolePrinter.ok("Space Truck atualizado com sucesso.");
        InputUtil.pausar(sc);
    }

    private void remover() {
        ConsolePrinter.secao("REMOVER SPACE TRUCK");
        int id = InputUtil.lerInteiro(sc, "  ID do Space Truck: ");
        String conf = InputUtil.lerString(sc, "  Confirmar remocao? (S/N): ");
        if (!conf.equalsIgnoreCase("S")) { ConsolePrinter.info("Cancelado."); InputUtil.pausar(sc); return; }
        if (service.remover(id)) ConsolePrinter.ok("Space Truck removido.");
        else                     ConsolePrinter.erro("Space Truck nao encontrado.");
        InputUtil.pausar(sc);
    }

    // ── Sub-menu de Tripulantes ───────────────────────────────────────────
    private void menuTripulantes() {
        int id = InputUtil.lerInteiro(sc, "  ID do Space Truck: ");
        SpaceTruck truck = service.buscarPorId(id);
        if (truck == null) { ConsolePrinter.erro("Space Truck nao encontrado."); InputUtil.pausar(sc); return; }

        int opc;
        do {
            ConsolePrinter.secao("TRIPULANTES - " + truck.getNome());
            ConsolePrinter.itemMenu(1, "Listar tripulantes");
            ConsolePrinter.itemMenu(2, "Adicionar tripulante");
            ConsolePrinter.itemMenu(3, "Remover tripulante");
            ConsolePrinter.itemMenu(0, "Voltar");
            opc = InputUtil.lerInteiroMinMax(sc, "  Opcao: ", 0, 3);

            switch (opc) {
                case 1:
                    List<Tripulante> lista = truck.getTripulantes();
                    if (lista.isEmpty()) ConsolePrinter.vazio();
                    else lista.forEach(t -> System.out.println("  " + t));
                    InputUtil.pausar(sc);
                    break;
                case 2:
                    String nome  = InputUtil.lerString(sc, "  Nome              : ");
                    String cargo = InputUtil.lerString(sc, "  Cargo             : ");
                    int    exp   = InputUtil.lerInteiroMinMax(sc, "  Experiencia (anos): ", 0, 50);
                    Tripulante trip = service.adicionarTripulante(truck.getId(), nome, cargo, exp);
                    if (trip != null) ConsolePrinter.ok("Tripulante adicionado: ID " + trip.getId());
                    InputUtil.pausar(sc);
                    break;
                case 3:
                    int idTrip = InputUtil.lerInteiro(sc, "  ID do tripulante: ");
                    if (service.removerTripulante(truck.getId(), idTrip))
                        ConsolePrinter.ok("Tripulante removido.");
                    else
                        ConsolePrinter.erro("Tripulante nao encontrado.");
                    InputUtil.pausar(sc);
                    break;
                case 0: break;
            }
        } while (opc != 0);
    }
}
