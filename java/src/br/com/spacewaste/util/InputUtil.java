package br.com.spacewaste.util;

import java.util.Scanner;

/**
 * Utilitário para leitura segura de dados do console.
 * Centraliza validação de entrada, evitando InputMismatchException nos menus.
 */
public class InputUtil {

    private InputUtil() {}

    public static int lerInteiro(Scanner sc, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = sc.nextLine().trim();
            try {
                return Integer.parseInt(entrada);
            } catch (NumberFormatException e) {
                System.out.println("  [!] Valor inválido. Digite um número inteiro.");
            }
        }
    }

    public static int lerInteiroMinMax(Scanner sc, String prompt, int min, int max) {
        while (true) {
            int valor = lerInteiro(sc, prompt);
            if (valor >= min && valor <= max) return valor;
            System.out.printf("  [!] Digite um valor entre %d e %d.%n", min, max);
        }
    }

    public static double lerDouble(Scanner sc, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = sc.nextLine().trim().replace(",", ".");
            try {
                return Double.parseDouble(entrada);
            } catch (NumberFormatException e) {
                System.out.println("  [!] Valor inválido. Digite um número (ex.: 1200.5).");
            }
        }
    }

    public static double lerDoublePositivo(Scanner sc, String prompt) {
        while (true) {
            double valor = lerDouble(sc, prompt);
            if (valor > 0) return valor;
            System.out.println("  [!] O valor deve ser maior que zero.");
        }
    }

    public static String lerString(Scanner sc, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = sc.nextLine().trim();
            if (!entrada.isEmpty()) return entrada;
            System.out.println("  [!] Campo obrigatório. Não pode ser vazio.");
        }
    }

    public static String lerStringOpcional(Scanner sc, String prompt) {
        System.out.print(prompt);
        return sc.nextLine().trim();
    }

    public static void pausar(Scanner sc) {
        System.out.print("\n  Pressione ENTER para continuar...");
        sc.nextLine();
    }
}
