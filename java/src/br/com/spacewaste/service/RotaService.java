package br.com.spacewaste.service;

import br.com.spacewaste.model.Detrito;
import br.com.spacewaste.model.PontoOrbital;

import java.util.ArrayList;
import java.util.List;

/**
 * Serviço de cálculo e otimização de rotas orbitais.
 * Implementa o algoritmo do vizinho mais próximo (Nearest Neighbor)
 * para minimizar o delta-V total da missão.
 */
public class RotaService {

    private int proximoId = 1;

    /**
     * Converte a lista de detritos em pontos orbitais e os ordena
     * usando o algoritmo do vizinho mais próximo — começa no detrito
     * de menor altitude (mais fácil de alcançar) e vai ao mais próximo.
     */
    public List<PontoOrbital> calcularRotaOtimizada(List<Detrito> detritos) {
        if (detritos.isEmpty()) return new ArrayList<>();

        List<PontoOrbital> pontos    = converterParaPontos(detritos);
        List<PontoOrbital> restantes = new ArrayList<>(pontos);
        List<PontoOrbital> rota      = new ArrayList<>();

        // Ponto inicial: menor altitude (menor delta-V de partida)
        PontoOrbital atual = restantes.stream()
                .min((a, b) -> Double.compare(a.getAltitudeKm(), b.getAltitudeKm()))
                .orElse(restantes.get(0));

        rota.add(atual);
        restantes.remove(atual);

        while (!restantes.isEmpty()) {
            PontoOrbital proximo = encontrarMaisProximo(atual, restantes);
            rota.add(proximo);
            restantes.remove(proximo);
            atual = proximo;
        }

        return rota;
    }

    /** Calcula a distância total percorrida em uma rota. */
    public double calcularDistanciaTotal(List<PontoOrbital> rota) {
        double total = 0;
        for (int i = 0; i < rota.size() - 1; i++) {
            total += rota.get(i).calcularDistancia(rota.get(i + 1));
        }
        return total;
    }

    // ── Privados ──────────────────────────────────────────────────────────
    private List<PontoOrbital> converterParaPontos(List<Detrito> detritos) {
        List<PontoOrbital> pontos = new ArrayList<>();
        for (Detrito d : detritos) {
            String ref = "Detrito-" + d.getId() + " / " + d.getNome();
            pontos.add(new PontoOrbital(proximoId++,
                    d.getAltitudeKm(), d.getInclinacaoGraus(),
                    d.getLongitudeGraus(), ref));
        }
        return pontos;
    }

    private PontoOrbital encontrarMaisProximo(PontoOrbital origem,
                                               List<PontoOrbital> candidatos) {
        PontoOrbital maisProximo = null;
        double menorDist = Double.MAX_VALUE;
        for (PontoOrbital p : candidatos) {
            double dist = origem.calcularDistancia(p);
            if (dist < menorDist) {
                menorDist   = dist;
                maisProximo = p;
            }
        }
        return maisProximo;
    }
}
