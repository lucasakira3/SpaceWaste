package br.com.spacewaste.model;

/**
 * Classe abstrata base para todos os objetos do sistema orbital.
 * Demonstra abstração e serve como superclasse para Detrito,
 * NaveColetora e EstacaoBase (herança / polimorfismo).
 */
public abstract class ObjetoEspacial {

    private int id;
    private String nome;
    private double altitudeKm;
    private double inclinacaoGraus;
    private double longitudeGraus;

    public ObjetoEspacial(int id, String nome, double altitudeKm,
                          double inclinacaoGraus, double longitudeGraus) {
        this.id            = id;
        this.nome          = nome;
        this.altitudeKm    = altitudeKm;
        this.inclinacaoGraus = inclinacaoGraus;
        this.longitudeGraus  = longitudeGraus;
    }

    // ── Métodos abstratos ─────────────────────────────────────────────────
    public abstract String getTipo();
    public abstract String getStatusStr();
    public abstract void exibir();

    // ── Getters e Setters ─────────────────────────────────────────────────
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public double getAltitudeKm() { return altitudeKm; }
    public void setAltitudeKm(double altitudeKm) { this.altitudeKm = altitudeKm; }

    public double getInclinacaoGraus() { return inclinacaoGraus; }
    public void setInclinacaoGraus(double inclinacaoGraus) { this.inclinacaoGraus = inclinacaoGraus; }

    public double getLongitudeGraus() { return longitudeGraus; }
    public void setLongitudeGraus(double longitudeGraus) { this.longitudeGraus = longitudeGraus; }

    @Override
    public String toString() {
        return String.format("[ID:%-3d] %-28s | %-26s | Alt:%7.1f km | Status: %s",
                id, nome, getTipo(), altitudeKm, getStatusStr());
    }
}
