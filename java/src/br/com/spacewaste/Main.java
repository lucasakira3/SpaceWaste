package br.com.spacewaste;

import br.com.spacewaste.enums.StatusNave;
import br.com.spacewaste.enums.TipoDetrito;
import br.com.spacewaste.menu.MenuPrincipal;
import br.com.spacewaste.model.EstacaoBase;
import br.com.spacewaste.model.SpaceTruck;
import br.com.spacewaste.service.*;

import java.util.Scanner;

/**
 * Ponto de entrada do sistema Space Waste.
 *
 * Arquitetura:
 *   model/     → entidades do domínio (ObjetoEspacial, Detrito, SpaceTruck, ...)
 *   enums/     → tipos enumerados (StatusDetrito, TipoDetrito, ...)
 *   service/   → regras de negócio e repositórios em memória
 *   menu/      → interface de usuário via console
 *   util/      → utilitários de I/O e formatação
 *
 * Conceitos de POO aplicados:
 *   - Abstração   : classe abstrata ObjetoEspacial + interface Coletavel
 *   - Herança     : Detrito, SpaceTruck e EstacaoBase estendem ObjetoEspacial
 *   - Encapsulamento : todos os atributos são private com getters/setters
 *   - Polimorfismo   : exibir() e getTipo() chamados via referência base em MenuRelatorio
 */
public class Main {

    public static void main(String[] args) {
        // ── Instância dos serviços ────────────────────────────────────────
        DetritoService detritoService = new DetritoService();
        SpaceTruckService    naveService    = new SpaceTruckService();
        EstacaoService estacaoService = new EstacaoService();
        RotaService    rotaService    = new RotaService();
        MissaoService  missaoService  = new MissaoService(rotaService);

        // ── Dados de demonstração ─────────────────────────────────────────
        carregarDadosDemo(detritoService, naveService, estacaoService);

        // ── Scanner único compartilhado por todos os menus ────────────────
        Scanner sc = new Scanner(System.in);

        // ── Iniciar o sistema ─────────────────────────────────────────────
        MenuPrincipal menuPrincipal = new MenuPrincipal(
                detritoService, naveService, estacaoService, missaoService, rotaService, sc);
        menuPrincipal.executar();

        sc.close();
    }

    // ─────────────────────────────────────────────────────────────────────
    // Dados pré-carregados para demonstração
    // (baseados em detritos reais registrados pelo LNE/ESA/NASA)
    // ─────────────────────────────────────────────────────────────────────
    private static void carregarDadosDemo(DetritoService ds, SpaceTruckService ns, EstacaoService es) {

        System.out.println("  Carregando dados de demonstração...");

        // ── Detritos ──────────────────────────────────────────────────────
        ds.cadastrar("Cosmos 1408 — Frag. 001", 480.0, 82.9, 45.0,
                TipoDetrito.FRAGMENTO_FOGUETE, 3.5, 7.66);

        ds.cadastrar("Fengyun-1C — Satélite", 855.0, 98.8, 110.0,
                TipoDetrito.SATELITE_INATIVO, 750.0, 7.45);

        ds.cadastrar("Iridium 33 — Painel", 780.0, 86.4, 60.0,
                TipoDetrito.PAINEL_SOLAR, 42.0, 7.48);

        ds.cadastrar("Delta II Upper Stage", 830.0, 98.7, 200.0,
                TipoDetrito.COMPONENTE_ESTRUTURAL, 1350.0, 7.46);

        ds.cadastrar("SNAP-10A Núcleo", 1307.0, 90.0, 0.0,
                TipoDetrito.BATERIA_MODULO, 440.0, 7.28);

        ds.cadastrar("BREEZE-M Tanque", 590.0, 49.5, 175.0,
                TipoDetrito.FRAGMENTO_FOGUETE, 880.0, 7.57);

        ds.cadastrar("Vanguard 1 — Corpo", 3750.0, 34.2, 90.0,
                TipoDetrito.SATELITE_INATIVO, 1.47, 6.95);

        // ── Space Trucks ──────────────────────────────────────────────────
        SpaceTruck sw1 = ns.cadastrar("SW-Alpha",  450.0, 51.6,  30.0, 5000.0, 95.0);
        SpaceTruck sw2 = ns.cadastrar("SW-Beta",   780.0, 86.4, 120.0, 8000.0, 72.0);
        SpaceTruck sw3 = ns.cadastrar("SW-Gamma",  830.0, 98.7, 200.0, 6500.0, 88.0);

        // Nave em manutenção
        SpaceTruck sw4 = ns.cadastrar("SW-Delta", 0.0, 0.0, 0.0, 4000.0, 15.0);
        sw4.setStatus(StatusNave.MANUTENCAO);

        // Tripulantes iniciais
        ns.adicionarTripulante(sw1.getId(), "Yuri Petrov",    "Piloto Orbital",    12);
        ns.adicionarTripulante(sw1.getId(), "Akira Tanaka",   "Eng. de Sistemas",   8);
        ns.adicionarTripulante(sw1.getId(), "Mia Santos",     "Especialista Coleta", 5);

        ns.adicionarTripulante(sw2.getId(), "James O'Brien",  "Piloto Orbital",    18);
        ns.adicionarTripulante(sw2.getId(), "Layla Hassan",   "Eng. de Propulsão", 10);

        ns.adicionarTripulante(sw3.getId(), "Pedro Alves",    "Piloto Orbital",     7);
        ns.adicionarTripulante(sw3.getId(), "Nadia Ivanova",  "Cientista Orbital",  9);

        // ── Estações Base ─────────────────────────────────────────────────
        EstacaoBase eOrbital = es.cadastrar(
                "Estação Orbital Alpha", 400.0, 51.6, 0.0,
                "LEO — Equatorial", 120_000.0);

        es.cadastrar(
                "Base de Reentrada BR-1", 0.0, 0.0, -46.6,
                "Terra — São Paulo, SP", 500_000.0);

        es.cadastrar(
                "Centro de Processamento GEO-1", 35_786.0, 0.0, 0.0,
                "GEO — Ponto Orbital 0°", 80_000.0);

        System.out.println("  [OK] " + ds.total() + " detritos, " +
                ns.total()  + " Space Trucks, " +
                es.total()  + " estações carregados.");
        System.out.println();
    }
}
