package br.com.spacewaste.menu;

import br.com.spacewaste.service.*;
import br.com.spacewaste.util.ConsolePrinter;
import br.com.spacewaste.util.InputUtil;

import java.util.Scanner;

/**
 * Menu principal do sistema Space Waste.
 * Centraliza a navegação entre todos os sub-menus.
 */
public class MenuPrincipal {

    private final MenuDetrito   menuDetrito;
    private final MenuSpaceTruck      menuNave;
    private final MenuEstacao   menuEstacao;
    private final MenuMissao    menuMissao;
    private final MenuRelatorio menuRelatorio;
    private final Scanner sc;

    public MenuPrincipal(DetritoService detritoService, SpaceTruckService naveService,
                         EstacaoService estacaoService, MissaoService missaoService,
                         RotaService rotaService, Scanner sc) {
        this.sc            = sc;
        this.menuDetrito   = new MenuDetrito(detritoService, sc);
        this.menuNave      = new MenuSpaceTruck(naveService, sc);
        this.menuEstacao   = new MenuEstacao(estacaoService, sc);
        this.menuRelatorio = new MenuRelatorio(detritoService, naveService, estacaoService, missaoService, sc);
        this.menuMissao    = new MenuMissao(missaoService, detritoService, naveService, estacaoService, rotaService, sc);
    }

    public void executar() {
        ConsolePrinter.banner();

        int opcao;
        do {
            ConsolePrinter.titulo("MENU PRINCIPAL");
            ConsolePrinter.itemMenu(1, "Gerenciar Detritos Espaciais");
            ConsolePrinter.itemMenu(2, "Gerenciar Space Trucks");
            ConsolePrinter.itemMenu(3, "Gerenciar Estações Base");
            ConsolePrinter.itemMenu(4, "Gerenciar Missões Orbitais");
            ConsolePrinter.itemMenu(5, "Relatórios e Estatísticas");
            ConsolePrinter.itemMenu(0, "Sair do sistema");
            ConsolePrinter.linha();

            opcao = InputUtil.lerInteiroMinMax(sc, "  Opção: ", 0, 5);

            switch (opcao) {
                case 1: menuDetrito.exibir();   break;
                case 2: menuNave.exibir();      break;
                case 3: menuEstacao.exibir();   break;
                case 4: menuMissao.exibir();    break;
                case 5: menuRelatorio.exibir(); break;
                case 0:
                    System.out.println();
                    ConsolePrinter.linhaDupla();
                    System.out.println("  Space Waste — encerrando sistema. Boa missão!");
                    ConsolePrinter.linhaDupla();
                    System.out.println();
                    break;
            }
        } while (opcao != 0);
    }
}
