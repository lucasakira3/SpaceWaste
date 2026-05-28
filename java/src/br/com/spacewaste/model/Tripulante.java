package br.com.spacewaste.model;

public class Tripulante {

    private int id;
    private String nome;
    private String cargo;
    private int experienciaAnos;

    public Tripulante(int id, String nome, String cargo, int experienciaAnos) {
        this.id               = id;
        this.nome             = nome;
        this.cargo            = cargo;
        this.experienciaAnos  = experienciaAnos;
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public int getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public int getExperienciaAnos() { return experienciaAnos; }
    public void setExperienciaAnos(int experienciaAnos) { this.experienciaAnos = experienciaAnos; }

    @Override
    public String toString() {
        return String.format("[ID:%-3d] %-25s | %-20s | %d ano(s) de experiência",
                id, nome, cargo, experienciaAnos);
    }
}
