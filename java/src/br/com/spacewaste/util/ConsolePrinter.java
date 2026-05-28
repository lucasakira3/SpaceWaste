package br.com.spacewaste.util;

/**
 * Utilitário de formatação do console.
 * Centraliza todos os padrões visuais do sistema.
 */
public class ConsolePrinter {

    private static final int LARGURA = 62;
    private static final String LINHA = "=".repeat(LARGURA);
    private static final String LINHA_SIMPLES = "-".repeat(LARGURA);

    private ConsolePrinter() {}

    public static void banner() {
        System.out.println();
        System.out.println("+" + LINHA + "+");
        System.out.println("|" + centralizar("*  SPACE WASTE - SISTEMA DE GESTAO  *") + "|");
        System.out.println("|" + centralizar("Gestao Inteligente de Detritos Orbitais") + "|");
        System.out.println("+" + LINHA + "+");
        System.out.println();
    }

    public static void titulo(String texto) {
        System.out.println();
        System.out.println("+" + LINHA + "+");
        System.out.println("|" + centralizar(texto) + "|");
        System.out.println("+" + LINHA + "+");
        System.out.println();
    }

    public static void secao(String texto) {
        System.out.println();
        System.out.println("  +" + "-".repeat(LARGURA - 2) + "+");
        System.out.println("  | " + padDireita(texto, LARGURA - 4) + " |");
        System.out.println("  +" + "-".repeat(LARGURA - 2) + "+");
    }

    public static void linha() {
        System.out.println("  " + LINHA_SIMPLES);
    }

    public static void linhaDupla() {
        System.out.println("  " + LINHA);
    }

    public static void ok(String msg) {
        System.out.println("  [OK] " + msg);
    }

    public static void erro(String msg) {
        System.out.println("  [ERRO] " + msg);
    }

    public static void info(String msg) {
        System.out.println("  [i] " + msg);
    }

    public static void aviso(String msg) {
        System.out.println("  [!] " + msg);
    }

    public static void itemMenu(int num, String descricao) {
        System.out.printf("  %2d. %s%n", num, descricao);
    }

    public static void vazio() {
        System.out.println("  (nenhum registro encontrado)");
    }

    // ── Auxiliares ────────────────────────────────────────────────────────
    private static String centralizar(String texto) {
        if (texto.length() >= LARGURA) return texto;
        int espacos = (LARGURA - texto.length()) / 2;
        return " ".repeat(espacos) + texto + " ".repeat(LARGURA - texto.length() - espacos);
    }

    private static String padDireita(String texto, int tamanho) {
        if (texto.length() >= tamanho) return texto.substring(0, tamanho);
        return texto + " ".repeat(tamanho - texto.length());
    }
}
