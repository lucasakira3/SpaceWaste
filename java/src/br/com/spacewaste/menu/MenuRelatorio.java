package br.com.spacewaste.menu;

import br.com.spacewaste.enums.StatusDetrito;
import br.com.spacewaste.enums.StatusMissao;
import br.com.spacewaste.enums.StatusNave;
import br.com.spacewaste.enums.TipoDetrito;
import br.com.spacewaste.model.EstacaoBase;
import br.com.spacewaste.model.ObjetoEspacial;
import br.com.spacewaste.service.DetritoService;
import br.com.spacewaste.service.EstacaoService;
import br.com.spacewaste.service.MissaoService;
import br.com.spacewaste.service.SpaceTruckService;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class MenuRelatorio {

    private final DetritoService detritoService;
    private final SpaceTruckService    naveService;
    private final EstacaoService estacaoService;
    private final MissaoService  missaoService;
    private final Scanner sc;

    public MenuRelatorio(DetritoService detritoService, SpaceTruckService naveService,
                         EstacaoService estacaoService, MissaoService missaoService,
                         Scanner sc) {
        this.detritoService = detritoService;
        this.naveService    = naveService;
        this.estacaoService = estacaoService;
        this.missaoService  = missaoService;
        this.sc             = sc;
    }

    public void exibir() {
        int opcao;
        do {
            ConsolePrinter.titulo("RELATÓRIOS E ESTATÍSTICAS");
            ConsolePrinter.itemMenu(1, "Resumo geral do sistema");
            ConsolePrinter.itemMenu(2, "Detritos por status");
            ConsolePrinter.itemMenu(3, "Detritos por tipo");
            ConsolePrinter.itemMenu(4, "Space Trucks por status");
            ConsolePrinter.itemMenu(5, "Missões por status");
            ConsolePrinter.itemMenu(6, "Capacidade das estações base");
            ConsolePrinter.itemMenu(7, "Listar todos os objetos espaciais");
            ConsolePrinter.itemMenu(0, "Voltar");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opção: ", 0, 7);

            switch (opcao) {
                case 1: resumoGeral();         break;
                case 2: detritosPorStatus();   break;
                case 3: detritosPorTipo();     break;
                case 4: navesPorStatus();      break;
                case 5: missoesPorStatus();    break;
                case 6: capacidadeEstacoes();  break;
                case 7: todosObjetos();        break;
                case 0: break;
            }
        } while (opcao != 0);
    }

    private void resumoGeral() {
        ConsolePrinter.secao("RESUMO GERAL DO SISTEMA — SPACE WASTE");
        System.out.println();
        System.out.printf("  %-35s %d%n", "Total de detritos cadastrados:",  detritoService.total());
        System.out.printf("  %-35s %d%n", "  └─ Flutuando:",     detritoService.contarPorStatus(StatusDetrito.FLUTUANDO));
        System.out.printf("  %-35s %d%n", "  └─ Em Coleta:",     detritoService.contarPorStatus(StatusDetrito.EM_COLETA));
        System.out.printf("  %-35s %d%n", "  └─ Coletados:",     detritoService.contarPorStatus(StatusDetrito.COLETADO));
        System.out.printf("  %-35s %d%n", "  └─ Reaproveitados:",detritoService.contarPorStatus(StatusDetrito.REAPROVEITADO));
        System.out.printf("  %-35s %d%n", "  └─ Carbonizados:",  detritoService.contarPorStatus(StatusDetrito.CARBONIZADO));
        System.out.printf("  %-35s %.2f kg%n", "Massa total gerenciada:", detritoService.massaTotalColetada());
        ConsolePrinter.linha();
        System.out.printf("  %-35s %d%n", "Total de Space Trucks:",  naveService.total());
        System.out.printf("  %-35s %d%n", "  └─ Disponíveis:",  naveService.contarPorStatus(StatusNave.DISPONIVEL));
        System.out.printf("  %-35s %d%n", "  └─ Em Missão:",    naveService.contarPorStatus(StatusNave.EM_MISSAO));
        System.out.printf("  %-35s %d%n", "  └─ Manutenção:",   naveService.contarPorStatus(StatusNave.MANUTENCAO));
        ConsolePrinter.linha();
        System.out.printf("  %-35s %d%n", "Total de estações:",     estacaoService.total());
        System.out.printf("  %-35s %.2f kg%n", "Cap. disponível total:", estacaoService.capacidadeTotalDisponivel());
        ConsolePrinter.linha();
        System.out.printf("  %-35s %d%n", "Total de missões:",       missaoService.total());
        System.out.printf("  %-35s %d%n", "  └─ Planejadas:",    missaoService.contarPorStatus(StatusMissao.PLANEJADA));
        System.out.printf("  %-35s %d%n", "  └─ Em Andamento:", missaoService.contarPorStatus(StatusMissao.EM_ANDAMENTO));
        System.out.printf("  %-35s %d%n", "  └─ Concluídas:",   missaoService.contarPorStatus(StatusMissao.CONCLUIDA));
        System.out.printf("  %-35s %d%n", "  └─ Canceladas:",   missaoService.contarPorStatus(StatusMissao.CANCELADA));
        InputUtil.pausar(sc);
    }

    private void detritosPorStatus() {
        ConsolePrinter.secao("DETRITOS POR STATUS");
        for (StatusDetrito s : StatusDetrito.values()) {
            long qtd = detritoService.contarPorStatus(s);
            System.out.printf("  %-20s : %d%n", s.getDescricao(), qtd);
        }
        InputUtil.pausar(sc);
    }

    private void detritosPorTipo() {
        ConsolePrinter.secao("DETRITOS POR TIPO");
        for (TipoDetrito t : TipoDetrito.values()) {
            long qtd = detritoService.buscarPorTipo(t).size();
            if (qtd > 0) System.out.printf("  %-30s : %d%n", t.getDescricao(), qtd);
        }
        InputUtil.pausar(sc);
    }

    private void navesPorStatus() {
        ConsolePrinter.secao("SPACE TRUCKS POR STATUS");
        for (StatusNave s : StatusNave.values()) {
            long qtd = naveService.contarPorStatus(s);
            System.out.printf("  %-25s : %d%n", s.getDescricao(), qtd);
        }
        InputUtil.pausar(sc);
    }

    private void missoesPorStatus() {
        ConsolePrinter.secao("MISSÕES POR STATUS");
        for (StatusMissao s : StatusMissao.values()) {
            long qtd = missaoService.contarPorStatus(s);
            System.out.printf("  %-20s : %d%n", s.getDescricao(), qtd);
        }
        InputUtil.pausar(sc);
    }

    private void capacidadeEstacoes() {
        ConsolePrinter.secao("CAPACIDADE DAS ESTAÇÕES BASE");
        List<EstacaoBase> lista = estacaoService.listarTodas();
        if (lista.isEmpty()) { ConsolePrinter.vazio(); InputUtil.pausar(sc); return; }

        System.out.printf("  %-25s %10s %10s %8s%n", "Estação", "Capacity", "Usado", "%");
        ConsolePrinter.linha();
        for (EstacaoBase e : lista) {
            System.out.printf("  %-25s %8.1f kg %8.1f kg %6.1f%%%n",
                    e.getNome(), e.getCapacidadeArmazenagemKg(),
                    e.getCargaAtualKg(), e.getPercentualOcupacao());
        }
        InputUtil.pausar(sc);
    }

    /**
     * Demonstra polimorfismo: percorre uma lista de ObjetoEspacial
     * (que mistura Detrito, SpaceTruck e EstacaoBase) e chama exibir()
     * de forma polimórfica em cada um.
     */
    private void todosObjetos() {
        ConsolePrinter.secao("TODOS OS OBJETOS ESPACIAIS (Polimorfismo)");

        List<ObjetoEspacial> objetos = new ArrayList<>();
        objetos.addAll(detritoService.listarTodos());
        objetos.addAll(naveService.listarTodos());
        objetos.addAll(estacaoService.listarTodas());

        if (objetos.isEmpty()) { ConsolePrinter.vazio(); InputUtil.pausar(sc); return; }

        System.out.printf("  %d objeto(s) no sistema:%n%n", objetos.size());
        for (ObjetoEspacial obj : objetos) {
            obj.exibir();   // chamada polimórfica — comportamento depende do tipo real
            System.out.println();
        }
        InputUtil.pausar(sc);
    }
}
