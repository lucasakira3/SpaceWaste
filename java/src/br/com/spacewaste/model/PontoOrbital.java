package br.com.spacewaste.model;

/**
 * Representa um ponto de parada na rota orbital de uma missão.
 * Utilizado pelo RotaService para montar e otimizar trajetos.
 */
public class PontoOrbital {

    private int id;
    private double altitudeKm;
    private double inclinacaoGraus;
    private double longitudeGraus;
    private String referencia;   // ex.: "Detrito-5 / Delta II Debris"

    public PontoOrbital(int id, double altitudeKm, double inclinacaoGraus,
                        double longitudeGraus, String referencia) {
        this.id              = id;
        this.altitudeKm      = altitudeKm;
        this.inclinacaoGraus = inclinacaoGraus;
        this.longitudeGraus  = longitudeGraus;
        this.referencia      = referencia;
    }

    /**
     * Distância simplificada entre dois pontos orbitais.
     * A variação de altitude tem peso maior por exigir mais combustível (delta-V).
     */
    public double calcularDistancia(PontoOrbital outro) {
        double da = (this.altitudeKm - outro.altitudeKm) * 2.0;
        double di = this.inclinacaoGraus - outro.inclinacaoGraus;
        double dl = this.longitudeGraus  - outro.longitudeGraus;
        return Math.sqrt(da * da + di * di + dl * dl);
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public int getId() { return id; }

    public double getAltitudeKm() { return altitudeKm; }
    public void setAltitudeKm(double altitudeKm) { this.altitudeKm = altitudeKm; }

    public double getInclinacaoGraus() { return inclinacaoGraus; }
    public void setInclinacaoGraus(double v) { this.inclinacaoGraus = v; }

    public double getLongitudeGraus() { return longitudeGraus; }
    public void setLongitudeGraus(double v) { this.longitudeGraus = v; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    @Override
    public String toString() {
        return String.format("  Ponto %-3d | Alt: %7.1f km | Incl: %5.1f gr | Long: %6.1f gr | Ref: %s",
                id, altitudeKm, inclinacaoGraus, longitudeGraus, referencia);
    }
}
