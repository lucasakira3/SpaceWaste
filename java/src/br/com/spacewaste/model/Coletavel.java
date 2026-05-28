package br.com.spacewaste.model;

/**
 * Interface que define o contrato de coleta para objetos
 * que podem ser recolhidos por uma NaveColetora.
 * Demonstra o conceito de interface / abstração em POO.
 */
public interface Coletavel {

    /** Verifica se o objeto está em condições de ser coletado. */
    boolean podeSerColetado();

    /** Retorna a massa do objeto em quilogramas. */
    double getMassaKg();

    /** Marca o objeto como coletado, alterando seu estado interno. */
    void marcarComoColetado();
}
