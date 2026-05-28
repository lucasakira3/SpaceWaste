package br.com.spacewaste.service;

import br.com.spacewaste.model.EstacaoBase;

import java.util.ArrayList;
import java.util.List;

/**
 * Camada de serviço para gerenciamento de estações base.
 */
public class EstacaoService {

    private final List<EstacaoBase> estacoes = new ArrayList<>();
    private int proximoId = 1;

    // ── Cadastro ──────────────────────────────────────────────────────────
    public EstacaoBase cadastrar(String nome, double altitudeKm, double inclinacaoGraus,
                                 double longitudeGraus, String localizacao,
                                 double capacidadeArmazenagemKg) {
        EstacaoBase e = new EstacaoBase(proximoId++, nome, altitudeKm,
                inclinacaoGraus, longitudeGraus, localizacao, capacidadeArmazenagemKg);
        estacoes.add(e);
        return e;
    }

    // ── Leitura ───────────────────────────────────────────────────────────
    public List<EstacaoBase> listarTodas() {
        return new ArrayList<>(estacoes);
    }

    public EstacaoBase buscarPorId(int id) {
        return estacoes.stream()
                .filter(e -> e.getId() == id)
                .findFirst().orElse(null);
    }

    // ── Atualização ───────────────────────────────────────────────────────
    public boolean atualizarDados(int id, String nome, double altitudeKm,
                                  double inclinacaoGraus, double longitudeGraus,
                                  String localizacao, double capacidadeArmazenagemKg) {
        EstacaoBase e = buscarPorId(id);
        if (e == null) return false;
        e.setNome(nome);
        e.setAltitudeKm(altitudeKm);
        e.setInclinacaoGraus(inclinacaoGraus);
        e.setLongitudeGraus(longitudeGraus);
        e.setLocalizacao(localizacao);
        e.setCapacidadeArmazenagemKg(capacidadeArmazenagemKg);
        return true;
    }

    // ── Remoção ───────────────────────────────────────────────────────────
    public boolean remover(int id) {
        return estacoes.removeIf(e -> e.getId() == id);
    }

    // ── Estatísticas ──────────────────────────────────────────────────────
    public int total() {
        return estacoes.size();
    }

    public double capacidadeTotalDisponivel() {
        return estacoes.stream()
                .mapToDouble(EstacaoBase::getCapacidadeDisponivel).sum();
    }
}
