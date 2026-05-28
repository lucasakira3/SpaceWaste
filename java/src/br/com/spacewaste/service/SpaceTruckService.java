package br.com.spacewaste.service;

import br.com.spacewaste.enums.StatusNave;
import br.com.spacewaste.model.SpaceTruck;
import br.com.spacewaste.model.Tripulante;

import java.util.ArrayList;
import java.util.List;

/**
 * Camada de servico para gerenciamento dos Space Trucks.
 */
public class SpaceTruckService {

    private final List<SpaceTruck> trucks = new ArrayList<>();
    private int proximoId      = 1;
    private int proximoIdTrip  = 1;

    // ── Cadastro ──────────────────────────────────────────────────────────
    public SpaceTruck cadastrar(String nome, double altitudeKm, double inclinacaoGraus,
                                double longitudeGraus, double capacidadeMaxKg,
                                double combustivelPercent) {
        SpaceTruck t = new SpaceTruck(proximoId++, nome, altitudeKm,
                inclinacaoGraus, longitudeGraus, capacidadeMaxKg, combustivelPercent);
        trucks.add(t);
        return t;
    }

    // ── Leitura ───────────────────────────────────────────────────────────
    public List<SpaceTruck> listarTodos() {
        return new ArrayList<>(trucks);
    }

    public SpaceTruck buscarPorId(int id) {
        return trucks.stream()
                .filter(t -> t.getId() == id)
                .findFirst().orElse(null);
    }

    public List<SpaceTruck> listarDisponiveis() {
        List<SpaceTruck> disponiveis = new ArrayList<>();
        for (SpaceTruck t : trucks) {
            if (t.getStatus() == StatusNave.DISPONIVEL) disponiveis.add(t);
        }
        return disponiveis;
    }

    public List<SpaceTruck> buscarPorStatus(StatusNave status) {
        List<SpaceTruck> resultado = new ArrayList<>();
        for (SpaceTruck t : trucks) {
            if (t.getStatus() == status) resultado.add(t);
        }
        return resultado;
    }

    // ── Atualizacao ───────────────────────────────────────────────────────
    public boolean atualizarDados(int id, String nome, double altitudeKm,
                                  double inclinacaoGraus, double longitudeGraus,
                                  double capacidadeMaxKg, double combustivelPercent) {
        SpaceTruck t = buscarPorId(id);
        if (t == null) return false;
        t.setNome(nome);
        t.setAltitudeKm(altitudeKm);
        t.setInclinacaoGraus(inclinacaoGraus);
        t.setLongitudeGraus(longitudeGraus);
        t.setCapacidadeMaxKg(capacidadeMaxKg);
        t.setCombustivelPercent(combustivelPercent);
        return true;
    }

    public boolean atualizarStatus(int id, StatusNave status) {
        SpaceTruck t = buscarPorId(id);
        if (t == null) return false;
        t.setStatus(status);
        return true;
    }

    // ── Remocao ───────────────────────────────────────────────────────────
    public boolean remover(int id) {
        return trucks.removeIf(t -> t.getId() == id);
    }

    // ── Tripulantes ───────────────────────────────────────────────────────
    public Tripulante adicionarTripulante(int truckId, String nome,
                                          String cargo, int experienciaAnos) {
        SpaceTruck truck = buscarPorId(truckId);
        if (truck == null) return null;
        Tripulante trip = new Tripulante(proximoIdTrip++, nome, cargo, experienciaAnos);
        truck.adicionarTripulante(trip);
        return trip;
    }

    public boolean removerTripulante(int truckId, int tripulanteId) {
        SpaceTruck truck = buscarPorId(truckId);
        if (truck == null) return false;
        return truck.removerTripulante(tripulanteId);
    }

    // ── Estatisticas ──────────────────────────────────────────────────────
    public long contarPorStatus(StatusNave status) {
        return trucks.stream().filter(t -> t.getStatus() == status).count();
    }

    public int total() {
        return trucks.size();
    }
}
