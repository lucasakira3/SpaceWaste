package br.com.spacewaste.model;

import br.com.spacewaste.enums.StatusNave;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa um Space Truck — o caminhao de lixo orbital responsavel
 * por coletar detritos espaciais e transporta-los ate a estacao base.
 * Herda de ObjetoEspacial.
 */
public class SpaceTruck extends ObjetoEspacial {

    private double      capacidadeMaxKg;
    private double      cargaAtualKg;
    private double      combustivelPercent;
    private StatusNave  status;
    private List<Tripulante> tripulantes;

    public SpaceTruck(int id, String nome, double altitudeKm, double inclinacaoGraus,
                      double longitudeGraus, double capacidadeMaxKg, double combustivelPercent) {
        super(id, nome, altitudeKm, inclinacaoGraus, longitudeGraus);
        this.capacidadeMaxKg    = capacidadeMaxKg;
        this.combustivelPercent = combustivelPercent;
        this.cargaAtualKg       = 0.0;
        this.status             = StatusNave.DISPONIVEL;
        this.tripulantes        = new ArrayList<>();
    }

    // ── Implementacao de ObjetoEspacial ───────────────────────────────────
    @Override
    public String getTipo() {
        return "Space Truck";
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
        System.out.printf ("  |  Altitude      : %.1f km%n", getAltitudeKm());
        System.out.printf ("  |  Inclinacao    : %.1f graus%n", getInclinacaoGraus());
        System.out.printf ("  |  Longitude     : %.1f graus%n", getLongitudeGraus());
        System.out.printf ("  |  Capacidade    : %.1f kg%n", capacidadeMaxKg);
        System.out.printf ("  |  Carga Atual   : %.1f kg (%.1f%% ocupado)%n",
                cargaAtualKg, getPercentualCarga());
        System.out.printf ("  |  Disponivel    : %.1f kg%n", getCapacidadeDisponivel());
        System.out.printf ("  |  Combustivel   : %.1f%%%n", combustivelPercent);
        System.out.printf ("  |  Status        : %s%n", status.getDescricao());
        System.out.printf ("  |  Tripulantes   : %d membro(s)%n", tripulantes.size());
        System.out.println("  +-----------------------------------------------------+");
    }

    // ── Logica de carga ───────────────────────────────────────────────────
    public boolean podeColetar(double massaDetrito) {
        return (cargaAtualKg + massaDetrito) <= capacidadeMaxKg;
    }

    public void adicionarCarga(double massaKg) {
        if (podeColetar(massaKg)) {
            cargaAtualKg += massaKg;
        }
    }

    public void descarregarCarga() {
        cargaAtualKg = 0.0;
    }

    public double getCapacidadeDisponivel() {
        return capacidadeMaxKg - cargaAtualKg;
    }

    public double getPercentualCarga() {
        return (capacidadeMaxKg == 0) ? 0 : (cargaAtualKg / capacidadeMaxKg) * 100.0;
    }

    // ── Tripulantes ───────────────────────────────────────────────────────
    public void adicionarTripulante(Tripulante t) {
        tripulantes.add(t);
    }

    public boolean removerTripulante(int idTripulante) {
        return tripulantes.removeIf(t -> t.getId() == idTripulante);
    }

    public List<Tripulante> getTripulantes() {
        return new ArrayList<>(tripulantes);
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public double getCapacidadeMaxKg() { return capacidadeMaxKg; }
    public void setCapacidadeMaxKg(double v) { this.capacidadeMaxKg = v; }

    public double getCargaAtualKg() { return cargaAtualKg; }
    public void setCargaAtualKg(double v) { this.cargaAtualKg = v; }

    public double getCombustivelPercent() { return combustivelPercent; }
    public void setCombustivelPercent(double v) { this.combustivelPercent = v; }

    public StatusNave getStatus() { return status; }
    public void setStatus(StatusNave status) { this.status = status; }
}
