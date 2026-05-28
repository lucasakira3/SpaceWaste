package br.com.spacewaste.model;

import br.com.spacewaste.enums.StatusDetrito;
import br.com.spacewaste.enums.TipoDescarte;
import br.com.spacewaste.enums.TipoDetrito;

/**
 * Representa um detrito / resíduo espacial orbitando a Terra.
 * Herda de ObjetoEspacial e implementa Coletavel.
 */
public class Detrito extends ObjetoEspacial implements Coletavel {

    private TipoDetrito   tipoDetrito;
    private double        massaKg;
    private double        velocidadeKms;   // km/s
    private StatusDetrito status;
    private TipoDescarte  tipoDescarte;

    public Detrito(int id, String nome, double altitudeKm, double inclinacaoGraus,
                   double longitudeGraus, TipoDetrito tipoDetrito, double massaKg,
                   double velocidadeKms) {
        super(id, nome, altitudeKm, inclinacaoGraus, longitudeGraus);
        this.tipoDetrito   = tipoDetrito;
        this.massaKg       = massaKg;
        this.velocidadeKms = velocidadeKms;
        this.status        = StatusDetrito.FLUTUANDO;
        this.tipoDescarte  = TipoDescarte.INDEFINIDO;
    }

    // ── Implementação de ObjetoEspacial ───────────────────────────────────
    @Override
    public String getTipo() {
        return tipoDetrito.getDescricao();
    }

    @Override
    public String getStatusStr() {
        return status.getDescricao();
    }

    @Override
    public void exibir() {
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  | [ID: %-3d] %s%n", getId(), getNome());
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  |  Tipo        : %s%n", tipoDetrito.getDescricao());
        System.out.printf ("  |  Altitude    : %.1f km%n", getAltitudeKm());
        System.out.printf ("  |  Inclinacao  : %.1f graus%n", getInclinacaoGraus());
        System.out.printf ("  |  Longitude   : %.1f graus%n", getLongitudeGraus());
        System.out.printf ("  |  Massa       : %.2f kg%n", massaKg);
        System.out.printf ("  |  Velocidade  : %.2f km/s%n", velocidadeKms);
        System.out.printf ("  |  Status      : %s%n", status.getDescricao());
        System.out.printf ("  |  Descarte    : %s%n", tipoDescarte.getDescricao());
        System.out.println("  +-----------------------------------------------------+");
    }

    // ── Implementação de Coletavel ────────────────────────────────────────
    @Override
    public boolean podeSerColetado() {
        return status == StatusDetrito.FLUTUANDO;
    }

    @Override
    public double getMassaKg() {
        return massaKg;
    }

    @Override
    public void marcarComoColetado() {
        this.status = StatusDetrito.COLETADO;
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public TipoDetrito getTipoDetrito() { return tipoDetrito; }
    public void setTipoDetrito(TipoDetrito tipoDetrito) { this.tipoDetrito = tipoDetrito; }

    public void setMassaKg(double massaKg) { this.massaKg = massaKg; }

    public double getVelocidadeKms() { return velocidadeKms; }
    public void setVelocidadeKms(double velocidadeKms) { this.velocidadeKms = velocidadeKms; }

    public StatusDetrito getStatus() { return status; }
    public void setStatus(StatusDetrito status) { this.status = status; }

    public TipoDescarte getTipoDescarte() { return tipoDescarte; }
    public void setTipoDescarte(TipoDescarte tipoDescarte) { this.tipoDescarte = tipoDescarte; }
}
