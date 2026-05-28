package br.com.spacewaste.model;

import br.com.spacewaste.enums.StatusMissao;
import br.com.spacewaste.enums.StatusNave;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa uma missao de coleta orbital.
 * Agrega SpaceTruck, EstacaoBase, lista de Detrito e rota de PontoOrbital.
 */
public class Missao {

    private int             id;
    private String          nome;
    private SpaceTruck      nave;
    private EstacaoBase     estacaoDestino;
    private List<Detrito>   detritos;
    private List<PontoOrbital> rota;
    private StatusMissao    status;
    private String          dataInicio;
    private String          dataFim;

    public Missao(int id, String nome, SpaceTruck nave, EstacaoBase estacaoDestino) {
        this.id              = id;
        this.nome            = nome;
        this.nave            = nave;
        this.estacaoDestino  = estacaoDestino;
        this.detritos        = new ArrayList<>();
        this.rota            = new ArrayList<>();
        this.status          = StatusMissao.PLANEJADA;
        this.dataInicio      = "--/--/----";
        this.dataFim         = "--/--/----";
    }

    // ── Operações de ciclo de vida ────────────────────────────────────────
    public boolean iniciar(String dataInicio) {
        if (status != StatusMissao.PLANEJADA) return false;
        if (detritos.isEmpty())               return false;
        this.status     = StatusMissao.EM_ANDAMENTO;
        this.dataInicio = dataInicio;
        nave.setStatus(StatusNave.EM_MISSAO);
        return true;
    }

    public boolean concluir(String dataFim) {
        if (status != StatusMissao.EM_ANDAMENTO) return false;
        this.status  = StatusMissao.CONCLUIDA;
        this.dataFim = dataFim;
        nave.setStatus(StatusNave.DISPONIVEL);
        nave.descarregarCarga();
        for (Detrito d : detritos) {
            estacaoDestino.receberDetrito(d);
        }
        return true;
    }

    public boolean cancelar() {
        if (status == StatusMissao.CONCLUIDA || status == StatusMissao.CANCELADA) return false;
        this.status = StatusMissao.CANCELADA;
        nave.setStatus(StatusNave.DISPONIVEL);
        for (Detrito d : detritos) {
            d.setStatus(br.com.spacewaste.enums.StatusDetrito.FLUTUANDO);
        }
        nave.descarregarCarga();
        return true;
    }

    // ── Gerenciamento de detritos ─────────────────────────────────────────
    public String adicionarDetrito(Detrito d) {
        if (!d.podeSerColetado())                 return "Detrito não está disponível para coleta.";
        if (!nave.podeColetar(d.getMassaKg()))    return "Space Truck sem capacidade para este detrito.";
        if (detritos.contains(d))                 return "Detrito já adicionado à missão.";
        detritos.add(d);
        nave.adicionarCarga(d.getMassaKg());
        d.setStatus(br.com.spacewaste.enums.StatusDetrito.EM_COLETA);
        return "OK";
    }

    public boolean removerDetrito(int idDetrito) {
        Detrito alvo = detritos.stream()
                .filter(d -> d.getId() == idDetrito)
                .findFirst().orElse(null);
        if (alvo == null) return false;
        detritos.remove(alvo);
        nave.setCargaAtualKg(nave.getCargaAtualKg() - alvo.getMassaKg());
        alvo.setStatus(br.com.spacewaste.enums.StatusDetrito.FLUTUANDO);
        return true;
    }

    // ── Cálculos ──────────────────────────────────────────────────────────
    public double calcularMassaTotal() {
        double total = 0;
        for (Detrito d : detritos) total += d.getMassaKg();
        return total;
    }

    // ── Exibição ──────────────────────────────────────────────────────────
    public void exibir() {
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  | [ID: %-3d] %s%n", id, nome);
        System.out.println("  +-----------------------------------------------------+");
        System.out.printf ("  |  Status       : %s%n", status.getDescricao());
        System.out.printf ("  |  Space Truck  : [%d] %s%n", nave.getId(), nave.getNome());
        System.out.printf ("  |  Estacao      : [%d] %s%n",
                estacaoDestino.getId(), estacaoDestino.getNome());
        System.out.printf ("  |  Detritos     : %d item(s) - %.2f kg total%n",
                detritos.size(), calcularMassaTotal());
        System.out.printf ("  |  Rota         : %d ponto(s) calculado(s)%n", rota.size());
        System.out.printf ("  |  Inicio       : %s%n", dataInicio);
        System.out.printf ("  |  Fim          : %s%n", dataFim);
        System.out.println("  +-----------------------------------------------------+");
    }

    // ── Getters e Setters ─────────────────────────────────────────────────
    public int getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public SpaceTruck getNave() { return nave; }
    public void setNave(SpaceTruck nave) { this.nave = nave; }

    public EstacaoBase getEstacaoDestino() { return estacaoDestino; }
    public void setEstacaoDestino(EstacaoBase e) { this.estacaoDestino = e; }

    public List<Detrito> getDetritos() { return new ArrayList<>(detritos); }

    public List<PontoOrbital> getRota() { return new ArrayList<>(rota); }
    public void setRota(List<PontoOrbital> rota) { this.rota = rota; }

    public StatusMissao getStatus() { return status; }

    public String getDataInicio() { return dataInicio; }
    public String getDataFim()    { return dataFim; }
}
