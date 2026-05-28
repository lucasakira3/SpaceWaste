package br.com.spacewaste.service;

import br.com.spacewaste.enums.StatusDetrito;
import br.com.spacewaste.enums.TipoDescarte;
import br.com.spacewaste.enums.TipoDetrito;
import br.com.spacewaste.model.Detrito;

import java.util.ArrayList;
import java.util.List;

/**
 * Camada de serviço para gerenciamento de detritos espaciais.
 * Mantém a lista em memória e expõe operações de CRUD + consultas.
 */
public class DetritoService {

    private final List<Detrito> detritos = new ArrayList<>();
    private int proximoId = 1;

    // ── Cadastro ──────────────────────────────────────────────────────────
    public Detrito cadastrar(String nome, double altitudeKm, double inclinacaoGraus,
                             double longitudeGraus, TipoDetrito tipo,
                             double massaKg, double velocidadeKms) {
        Detrito d = new Detrito(proximoId++, nome, altitudeKm,
                inclinacaoGraus, longitudeGraus, tipo, massaKg, velocidadeKms);
        detritos.add(d);
        return d;
    }

    // ── Leitura ───────────────────────────────────────────────────────────
    public List<Detrito> listarTodos() {
        return new ArrayList<>(detritos);
    }

    public Detrito buscarPorId(int id) {
        return detritos.stream()
                .filter(d -> d.getId() == id)
                .findFirst().orElse(null);
    }

    public List<Detrito> buscarPorStatus(StatusDetrito status) {
        List<Detrito> resultado = new ArrayList<>();
        for (Detrito d : detritos) {
            if (d.getStatus() == status) resultado.add(d);
        }
        return resultado;
    }

    public List<Detrito> buscarPorTipo(TipoDetrito tipo) {
        List<Detrito> resultado = new ArrayList<>();
        for (Detrito d : detritos) {
            if (d.getTipoDetrito() == tipo) resultado.add(d);
        }
        return resultado;
    }

    public List<Detrito> listarColetaveis() {
        return buscarPorStatus(StatusDetrito.FLUTUANDO);
    }

    // ── Atualização ───────────────────────────────────────────────────────
    public boolean atualizarDados(int id, String nome, double altitudeKm,
                                  double inclinacaoGraus, double longitudeGraus,
                                  double massaKg, double velocidadeKms) {
        Detrito d = buscarPorId(id);
        if (d == null) return false;
        d.setNome(nome);
        d.setAltitudeKm(altitudeKm);
        d.setInclinacaoGraus(inclinacaoGraus);
        d.setLongitudeGraus(longitudeGraus);
        d.setMassaKg(massaKg);
        d.setVelocidadeKms(velocidadeKms);
        return true;
    }

    public boolean atualizarStatus(int id, StatusDetrito novoStatus) {
        Detrito d = buscarPorId(id);
        if (d == null) return false;
        d.setStatus(novoStatus);
        return true;
    }

    public boolean atualizarDescarte(int id, TipoDescarte descarte) {
        Detrito d = buscarPorId(id);
        if (d == null) return false;
        d.setTipoDescarte(descarte);
        return true;
    }

    // ── Remoção ───────────────────────────────────────────────────────────
    public boolean remover(int id) {
        return detritos.removeIf(d -> d.getId() == id);
    }

    // ── Estatísticas ──────────────────────────────────────────────────────
    public long contarPorStatus(StatusDetrito status) {
        return detritos.stream().filter(d -> d.getStatus() == status).count();
    }

    public double massaTotalColetada() {
        return detritos.stream()
                .filter(d -> d.getStatus() == StatusDetrito.COLETADO
                          || d.getStatus() == StatusDetrito.REAPROVEITADO
                          || d.getStatus() == StatusDetrito.CARBONIZADO)
                .mapToDouble(Detrito::getMassaKg).sum();
    }

    public int total() {
        return detritos.size();
    }
}
