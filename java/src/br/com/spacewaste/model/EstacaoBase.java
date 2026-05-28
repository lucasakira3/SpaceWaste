package br.com.spacewaste.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Representa uma estação base — ponto de retorno e processamento dos detritos.
 * Pode ser orbital (LEO/GEO) ou terrestre (para reaproveitamento).
 * Herda de ObjetoEspacial.
 */
public class EstacaoBase extends ObjetoEspacial {

    private double       capacidadeArmazenagemKg;
    private double       cargaAtualKg;
    private String       localizacao;
    private List<Detrito> detritosArmazenados;

    public EstacaoBase(int id, String nome, double altitudeKm, double inclinacaoGraus,
                       double longitudeGraus, String localizacao, double capacidadeArmazenagemKg) {
        super(id, nome, altitudeKm, inclinacaoGraus, longitudeGraus);
        this.localizacao              = localizacao;
        this.capacidadeArmazenagemKg  = capacidadeArmazenagemKg;
        this.cargaAtualKg             = 0.0;
        this.detritosArmazenados      = new ArrayList<>();
    }

    // ── Implementação de ObjetoEspacial ───────────────────────────────────
    @Override
    public String getTipo() {
        return "Estação Base";
    }

    @Override
    public String getStatusStr() {
        double ocupacao = getPercentualOcupacao();
        if (ocupacao >= 90) return "LOTADA";
        if (ocupacao >= 60) return "Capacidade Alta";
        return "Operacional";
    }

    @Override
    public void exibir() {
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  | [ID: %-3d] %s%n", getId(), getNome());
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  |  Localizacao  : %s%n", localizacao);
        System.out.printf ("  |  Altitude     : %.1f km%n", getAltitudeKm());
        System.out.printf ("  |  Capacidade   : %.1f kg%n", capacidadeArmazenagemKg);
        System.out.printf ("  |  Armazenado   : %.1f kg (%.1f%% ocupado)%n",
                cargaAtualKg, getPercentualOcupacao());
        System.out.printf ("  |  Disponivel   : %.1f kg%n", getCapacidadeDisponivel());
        System.out.printf ("  |  Detritos     : %d item(s)%n", detritosArmazenados.size());
        System.out.printf ("  |  Status       : %s%n", getStatusStr());
        System.out.println("  +-----------------------------------------------------+");
    }

    // ── Lógica de armazenamento ───────────────────────────────────────────
    public boolean receberDetrito(Detrito d) {
        if (cargaAtualKg + d.getMassaKg() > capacidadeArmazenagemKg) {
            return false;
        }
        detritosArmazenados.add(d);
        cargaAtualKg += d.getMassaKg();
        return true;
    }

    public double getCapacidadeDisponivel() {
        return capacidadeArmazenagemKg - cargaAtualKg;
    }

    public double getPercentualOcupacao() {
        return (capacidadeArmazenagemKg == 0) ? 0
                : (cargaAtualKg / capacidadeArmazenagemKg) * 100.0;
    }

    public List<Detrito> getDetritosArmazenados() {
        return new ArrayList<>(detritosArmazenados);
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public double getCapacidadeArmazenagemKg() { return capacidadeArmazenagemKg; }
    public void setCapacidadeArmazenagemKg(double v) { this.capacidadeArmazenagemKg = v; }

    public double getCargaAtualKg() { return cargaAtualKg; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }
}
