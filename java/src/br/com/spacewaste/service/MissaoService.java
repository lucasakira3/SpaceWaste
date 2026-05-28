package br.com.spacewaste.service;

import br.com.spacewaste.enums.StatusMissao;
import br.com.spacewaste.model.Detrito;
import br.com.spacewaste.model.EstacaoBase;
import br.com.spacewaste.model.Missao;
import br.com.spacewaste.model.SpaceTruck;
import br.com.spacewaste.model.PontoOrbital;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Camada de serviço para gerenciamento de missões de coleta orbital.
 * Orquestra as operações entre SpaceTruck, Detrito, EstacaoBase e RotaService.
 */
public class MissaoService {

    private final List<Missao> missoes = new ArrayList<>();
    private final RotaService  rotaService;
    private int proximoId = 1;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public MissaoService(RotaService rotaService) {
        this.rotaService = rotaService;
    }

    // ── Cadastro ──────────────────────────────────────────────────────────
    public Missao planejar(String nome, SpaceTruck nave, EstacaoBase estacao) {
        Missao m = new Missao(proximoId++, nome, nave, estacao);
        missoes.add(m);
        return m;
    }

    // ── Leitura ───────────────────────────────────────────────────────────
    public List<Missao> listarTodas() {
        return new ArrayList<>(missoes);
    }

    public Missao buscarPorId(int id) {
        return missoes.stream()
                .filter(m -> m.getId() == id)
                .findFirst().orElse(null);
    }

    public List<Missao> buscarPorStatus(StatusMissao status) {
        List<Missao> resultado = new ArrayList<>();
        for (Missao m : missoes) {
            if (m.getStatus() == status) resultado.add(m);
        }
        return resultado;
    }

    // ── Gerenciamento de Detritos na Missão ───────────────────────────────
    public String adicionarDetrito(int missaoId, Detrito detrito) {
        Missao m = buscarPorId(missaoId);
        if (m == null)                            return "Missão não encontrada.";
        if (m.getStatus() != StatusMissao.PLANEJADA) return "Só é possível adicionar detritos a missões planejadas.";
        return m.adicionarDetrito(detrito);
    }

    public boolean removerDetrito(int missaoId, int detritoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null) return false;
        return m.removerDetrito(detritoId);
    }

    // ── Rota ──────────────────────────────────────────────────────────────
    public List<PontoOrbital> calcularRota(int missaoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null || m.getDetritos().isEmpty()) return new ArrayList<>();
        List<PontoOrbital> rota = rotaService.calcularRotaOtimizada(m.getDetritos());
        m.setRota(rota);
        return rota;
    }

    // ── Ciclo de vida ─────────────────────────────────────────────────────
    public String iniciar(int missaoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null) return "Missão não encontrada.";
        String hoje = LocalDate.now().format(FMT);
        boolean ok = m.iniciar(hoje);
        if (!ok) {
            if (m.getDetritos().isEmpty()) return "A missão não possui detritos. Adicione ao menos um.";
            return "Apenas missões com status PLANEJADA podem ser iniciadas.";
        }
        return "OK";
    }

    public String concluir(int missaoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null) return "Missão não encontrada.";
        String hoje = LocalDate.now().format(FMT);
        boolean ok = m.concluir(hoje);
        if (!ok) return "Apenas missões EM ANDAMENTO podem ser concluídas.";
        return "OK";
    }

    public String cancelar(int missaoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null) return "Missão não encontrada.";
        boolean ok = m.cancelar();
        if (!ok) return "Não é possível cancelar uma missão concluída ou já cancelada.";
        return "OK";
    }

    // ── Remoção ───────────────────────────────────────────────────────────
    public boolean remover(int missaoId) {
        Missao m = buscarPorId(missaoId);
        if (m == null) return false;
        if (m.getStatus() == StatusMissao.EM_ANDAMENTO) return false;
        return missoes.remove(m);
    }

    // ── Estatísticas ──────────────────────────────────────────────────────
    public long contarPorStatus(StatusMissao status) {
        return missoes.stream().filter(m -> m.getStatus() == status).count();
    }

    public int total() {
        return missoes.size();
    }
}
