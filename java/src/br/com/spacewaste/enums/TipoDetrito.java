package br.com.spacewaste.enums;

public enum TipoDetrito {
    SATELITE_INATIVO("Satélite Inativo"),
    FRAGMENTO_FOGUETE("Fragmento de Foguete"),
    PAINEL_SOLAR("Painel Solar Danificado"),
    COMPONENTE_ESTRUTURAL("Componente Estrutural"),
    DETRITOS_COLISAO("Detritos de Colisão"),
    BATERIA_MODULO("Bateria / Módulo de Energia"),
    OUTRO("Outro");

    private final String descricao;

    TipoDetrito(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
}
